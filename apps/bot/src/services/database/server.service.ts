import {mongoClient} from '@epic-helper/services';
import type {IEnchantChannel, IServer} from '@epic-helper/models';
import {serverSchema} from '@epic-helper/models';
import type {RPG_RANDOM_EVENTS} from '@epic-helper/constants';
import type {UpdateQuery} from 'mongoose';
import {typedObjectEntries} from '@epic-helper/utils';
import {redisServerAccount} from '../redis/server-account.redis';
import mongooseLeanDefaults from 'mongoose-lean-defaults';
import {redisUserBoostedServers} from '../redis/user-boosted-servers.redis';

serverSchema.post('findOneAndUpdate', async function (doc) {
  if (!doc) return;
  await redisServerAccount.setServer(doc.serverId, doc);
});

serverSchema.plugin(mongooseLeanDefaults);

const dbServer = mongoClient.model('servers', serverSchema);

interface IRegisterServerProps {
  serverId: string;
  name: string;
}

const registerServer = async ({
  serverId,
  name,
}: IRegisterServerProps): Promise<IServer> => {
  const server = await getServer({serverId});

  if (!server) {
    const newServer = new dbServer({
      serverId,
      name,
    });

    await newServer.save();
    return newServer;
  }
  return server;
};

interface IGetServerProps {
  serverId: string;
}

const getServer = async ({
  serverId,
}: IGetServerProps): Promise<IServer | null> => {
  const cachedServer = await redisServerAccount.getServer(serverId);
  if (cachedServer) return cachedServer;
  const server = await dbServer.findOne({serverId}).lean({defaults: true});

  if (server) await redisServerAccount.setServer(serverId, server);
  return server ?? null;
};

const listRegisteredServersId = async (): Promise<string[]> => {
  const servers = await dbServer
    .find(
      {},
      {
        serverId: 1,
      },
    )
    .lean();
  return servers?.map((server) => server.serverId) ?? [];
};

interface IGetEnchantChannels {
  serverId: string;
}

const getEnchantChannels = async ({
  serverId,
}: IGetEnchantChannels): Promise<IEnchantChannel[]> => {
  const server = await getServer({serverId});

  return server?.settings?.enchant?.channels ?? [];
};

interface IAddEnchantChannels {
  serverId: string;
  channels: IEnchantChannel[];
}

const addEnchantChannels = async ({
  serverId,
  channels,
}: IAddEnchantChannels) => {
  await dbServer.findOneAndUpdate(
    {serverId},
    {
      $addToSet: {
        'settings.enchant.channels': {
          $each: channels,
        },
      },
    },
    {new: true},
  );
};

interface IRemoveEnchantChannels {
  serverId: string;
  channelIds: string[];
}

const removeEnchantChannels = async ({
  serverId,
  channelIds,
}: IRemoveEnchantChannels) => {
  await dbServer.findOneAndUpdate(
    {serverId},
    {
      $pull: {
        'settings.enchant.channels': {
          channelId: {
            $in: channelIds,
          },
        },
      },
    },
    {new: true},
  );
};

interface IUpdateEnchantChannel {
  serverId: string;
  channelId: string;
  settings: IEnchantChannel;
}

const updateEnchantChannel = async ({
  serverId,
  channelId,
  settings,
}: IUpdateEnchantChannel) => {
  await dbServer.findOneAndUpdate(
    {serverId, 'settings.enchant.channels.channelId': channelId},
    {
      $set: {
        'settings.enchant.channels.$': settings,
      },
    },
    {new: true},
  );
};

interface IResetEnchantChannels {
  serverId: string;
}

const resetEnchantChannels = async ({serverId}: IResetEnchantChannels) => {
  await dbServer.findOneAndUpdate(
    {serverId},
    {
      $set: {
        'settings.enchant.channels': [],
      },
    },
    {
      new: true,
    },
  );
};

interface IUpdateEnchantMuteDuration {
  serverId: string;
  duration: number;
}

const updateEnchantMuteDuration = async ({
  serverId,
  duration,
}: IUpdateEnchantMuteDuration) => {
  await dbServer.findOneAndUpdate(
    {serverId},
    {
      $set: {
        'settings.enchant.muteDuration': duration,
      },
    },
    {new: true},
  );
};

interface IUpdateRandomEvents {
  serverId: string;
  randomEvents: Partial<
    Record<ValuesOf<typeof RPG_RANDOM_EVENTS>, string | null>
  >;
}

const updateRandomEvents = async ({
  serverId,
  randomEvents,
}: IUpdateRandomEvents): Promise<IServer | null> => {
  const query: UpdateQuery<IServer> = {
    $set: {},
    $unset: {},
  };
  for (const [key, value] of typedObjectEntries(randomEvents)) {
    if (value === null) {
      query.$unset![`settings.randomEvent.${key}`] = '';
    } else {
      query.$set![`settings.randomEvent.${key}`] = value;
    }
  }
  await dbServer.findOneAndUpdate({serverId}, query, {new: true});
  return await getServer({serverId});
};

interface ISetTTVerificationChannel {
  serverId: string;
  channelId: string;
}

const setTTVerificationChannel = async ({
  serverId,
  channelId,
}: ISetTTVerificationChannel) => {
  await dbServer.findOneAndUpdate(
    {serverId},
    {
      $set: {'settings.ttVerification.channelId': channelId},
    },
    {new: true},
  );

  return await getServer({serverId});
};

interface IIsTTVerificationRuleExists {
  serverId: string;
  roleId: string;
}

const isTTVerificationRuleExists = async ({
  serverId,
  roleId,
}: IIsTTVerificationRuleExists) => {
  const server = await getServer({serverId});

  return (
    server?.settings.ttVerification.rules.some(
      (rule) => rule.roleId === roleId,
    ) ?? false
  );
};

interface ISetTTVerificationRule {
  serverId: string;
  roleId: string;
  minTT: number;
  maxTT?: number;
  message?: string;
}

const setTTVerificationRule = async ({
  serverId,
  roleId,
  minTT,
  maxTT,
  message,
}: ISetTTVerificationRule) => {
  const isExists = await isTTVerificationRuleExists({serverId, roleId});
  if (!isExists) {
    await dbServer.findOneAndUpdate(
      {serverId},
      {
        $push: {
          'settings.ttVerification.rules': {
            roleId,
            minTT,
            maxTT,
            message,
          },
        },
      },
      {new: true},
    );
  } else {
    await dbServer.findOneAndUpdate(
      {serverId, 'settings.ttVerification.rules.roleId': roleId},
      {
        $set: {
          'settings.ttVerification.rules.$': {
            roleId,
            minTT,
            maxTT,
            message,
          },
        },
      },
      {new: true},
    );
  }
  return await getServer({serverId});
};

interface IRemoveTTVerificationRule {
  serverId: string;
  roleId: string;
}

const removeTTVerificationRule = async ({
  serverId,
  roleId,
}: IRemoveTTVerificationRule) => {
  await dbServer.findOneAndUpdate(
    {serverId},
    {
      $pull: {
        'settings.ttVerification.rules': {
          roleId,
        },
      },
    },
    {new: true},
  );
  return await getServer({serverId});
};

interface IGetUserBoostedServers {
  userId: string;
}

export interface IGetUserBoostedServersResponse {
  serverId: string;
  token: number;
  name: string;
}

const getUserBoostedServers = async ({userId}: IGetUserBoostedServers) => {
  const cachedData = await redisUserBoostedServers.get(userId);
  if (cachedData) return cachedData;
  const servers = await dbServer.aggregate<IGetUserBoostedServersResponse>([
    {
      $match: {
        tokens: {
          $elemMatch: {
            userId,
          },
        },
      },
    },
    {
      $project: {
        serverId: 1,
        name: 1,
        token: {
          $arrayElemAt: [
            {
              $filter: {
                input: '$tokens',
                as: 'token',
                cond: {
                  $eq: ['$$token.userId', userId],
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        serverId: 1,
        name: 1,
        token: '$token.amount',
      },
    },
  ]);
  await redisUserBoostedServers.set(userId, servers);
  return servers ?? [];
};

interface IAddTokens {
  serverId: string;
  userId: string;
  amount: number;
}

const addTokens = async ({serverId, userId, amount}: IAddTokens) => {
  const server = await getServer({serverId});
  const isUserExists = server?.tokens.some((token) => token.userId === userId);
  if (isUserExists) {
    await dbServer.findOneAndUpdate(
      {
        serverId,
        'tokens.userId': userId,
      },
      {
        $inc: {
          'tokens.$.amount': amount,
        },
      },
      {new: true},
    );
  } else {
    await dbServer.findOneAndUpdate(
      {
        serverId,
      },
      {
        $push: {
          tokens: {
            userId,
            amount: amount,
          },
        },
      },
      {new: true},
    );
  }
  await redisUserBoostedServers.del(userId);
};

interface IRemoveTokens {
  serverId: string;
  userId: string;
  tokens?: number;
}

const removeTokens = async ({serverId, userId, tokens}: IRemoveTokens) => {
  const server = await getServer({serverId});
  const isUserExists = server?.tokens.some((token) => token.userId === userId);

  if (!isUserExists || !server) return;
  const tokenBoosted = server.tokens.find(
    (token) => token.userId === userId,
  )?.amount;
  if (!tokenBoosted) return;
  const toRemove = tokens === undefined || tokens >= tokenBoosted;
  if (toRemove) {
    await dbServer.findOneAndUpdate(
      {
        serverId,
      },
      {
        $pull: {
          tokens: {
            userId,
          },
        },
      },
      {new: true},
    );
  } else {
    await dbServer.findOneAndUpdate(
      {
        serverId,
        'tokens.userId': userId,
      },
      {
        $inc: {
          'tokens.$.amount': -tokens,
        },
      },
      {new: true},
    );
  }
  await redisUserBoostedServers.del(userId);
};

interface IAddServerAdmins {
  serverId: string;
  usersId: string[];
}

const addServerAdmins = async ({serverId, usersId}: IAddServerAdmins) => {
  await dbServer.findOneAndUpdate(
    {serverId},
    {
      $addToSet: {
        'settings.admin.usersId': {
          $each: usersId,
        },
      },
    },
    {new: true},
  );
  return await getServer({serverId});
};

interface IRemoveServerAdmins {
  serverId: string;
  usersId: string[];
}

const removeServerAdmins = async ({serverId, usersId}: IRemoveServerAdmins) => {
  await dbServer.findOneAndUpdate(
    {serverId},
    {
      $pull: {
        'settings.admin.usersId': {
          $in: usersId,
        },
      },
    },
    {new: true},
  );
  return await getServer({serverId});
};

interface IClearServerAdmins {
  serverId: string;
}

const clearServerAdmins = async ({serverId}: IClearServerAdmins) => {
  await dbServer.findOneAndUpdate(
    {serverId},
    {
      $set: {
        'settings.admin.usersId': [],
      },
    },
    {new: true},
  );
  return await getServer({serverId});
};

interface IAddServerAdminRoles {
  serverId: string;
  rolesId: string[];
}

const addServerAdminRoles = async ({
  serverId,
  rolesId,
}: IAddServerAdminRoles) => {
  await dbServer.findOneAndUpdate(
    {serverId},
    {
      $addToSet: {
        'settings.admin.rolesId': {
          $each: rolesId,
        },
      },
    },
    {new: true},
  );
  return await getServer({serverId});
};

interface IRemoveServerAdminRoles {
  serverId: string;
  rolesId: string[];
}

const removeServerAdminRoles = async ({
  serverId,
  rolesId,
}: IRemoveServerAdminRoles) => {
  await dbServer.findOneAndUpdate(
    {serverId},
    {
      $pull: {
        'settings.admin.rolesId': {
          $in: rolesId,
        },
      },
    },
    {new: true},
  );
  return await getServer({serverId});
};

interface IClearServerAdminRoles {
  serverId: string;
}

const clearServerAdminRoles = async ({serverId}: IClearServerAdminRoles) => {
  await dbServer.findOneAndUpdate(
    {serverId},
    {$set: {'settings.admin.rolesId': []}},
    {new: true},
  );
  return await getServer({serverId});
};

interface IUpdateServerToggle {
  serverId: string;
  query: UpdateQuery<IServer>;
}

const updateServerToggle = async ({serverId, query}: IUpdateServerToggle) => {
  await dbServer.findOneAndUpdate({serverId}, query, {new: true});
  return await getServer({serverId});
};

interface IResetToggle {
  serverId: string;
}

const resetServerToggle = async ({serverId}: IResetToggle) => {
  await dbServer.findOneAndUpdate(
    {serverId},
    {$unset: {toggle: ''}},
    {new: true},
  );
  return await getServer({serverId});
};

export const serverService = {
  registerServer,
  getServer,
  listRegisteredServersId,
  getEnchantChannels,
  addEnchantChannels,
  removeEnchantChannels,
  updateEnchantChannel,
  resetEnchantChannels,
  updateEnchantMuteDuration,
  updateRandomEvents,
  setTTVerificationChannel,
  isTTVerificationRuleExists,
  setTTVerificationRule,
  removeTTVerificationRule,
  getUserBoostedServers,
  addTokens,
  removeTokens,
  addServerAdmins,
  removeServerAdmins,
  clearServerAdmins,
  addServerAdminRoles,
  removeServerAdminRoles,
  clearServerAdminRoles,
  updateServerToggle,
  resetServerToggle,
};
