import {mongoClient} from '@epic-helper/services';
import {IEnchantChannel, IServer, serverSchema} from '@epic-helper/models';
import {RPG_RANDOM_EVENTS} from '@epic-helper/constants';
import {UpdateQuery} from 'mongoose';
import {typedObjectEntries} from '@epic-helper/utils';

const dbServer = mongoClient.model('servers', serverSchema);

interface IRegisterServerProps {
  serverId: string;
  name: string;
}

const registerServer = async ({serverId, name}: IRegisterServerProps): Promise<IServer> => {
  const server = await dbServer.findOne({serverId});

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

const getServer = async ({serverId}: IGetServerProps): Promise<IServer | null> => {
  const server = await dbServer.findOne({serverId});

  return server ?? null;
};

const listRegisteredServersId = async (): Promise<string[]> => {
  const servers = await dbServer.find(
    {},
    {
      serverId: 1,
    }
  );
  return servers?.map((server) => server.serverId) ?? [];
};

const findServerById = async (serverId: string): Promise<IServer | null> => {
  const server = await dbServer.findOne({serverId});

  if (!server) {
    return null;
  }
  return server;
};

interface IGetEnchantChannels {
  serverId: string;
}

const getEnchantChannels = async ({serverId}: IGetEnchantChannels): Promise<IEnchantChannel[]> => {
  const server = await dbServer.findOne({serverId});

  if (!server) {
    return [];
  }
  return server?.settings?.enchant?.channels ?? [];
};

interface IAddEnchantChannels {
  serverId: string;
  channels: IEnchantChannel[];
}

const addEnchantChannels = async ({serverId, channels}: IAddEnchantChannels) => {
  await dbServer.updateOne(
    {serverId},
    {
      $addToSet: {
        'settings.enchant.channels': {
          $each: channels,
        },
      },
    }
  );
};

interface IRemoveEnchantChannels {
  serverId: string;
  channelIds: string[];
}

const removeEnchantChannels = async ({serverId, channelIds}: IRemoveEnchantChannels) => {
  await dbServer.updateOne(
    {serverId},
    {
      $pull: {
        'settings.enchant.channels': {
          channelId: {
            $in: channelIds,
          },
        },
      },
    }
  );
};

interface IUpdateEnchantChannel {
  serverId: string;
  channelId: string;
  settings: IEnchantChannel;
}

const updateEnchantChannel = async ({serverId, channelId, settings}: IUpdateEnchantChannel) => {
  await dbServer.updateOne(
    {serverId, 'settings.enchant.channels.channelId': channelId},
    {
      $set: {
        'settings.enchant.channels.$': settings,
      },
    }
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
      projection: {
        'settings.enchant.channels': 1,
      },
    }
  );
};

interface IUpdateEnchantMuteDuration {
  serverId: string;
  duration: number;
}

const updateEnchantMuteDuration = async ({serverId, duration}: IUpdateEnchantMuteDuration) => {
  await dbServer.findOneAndUpdate(
    {serverId},
    {
      $set: {
        'settings.enchant.muteDuration': duration,
      },
    }
  );
};

interface IUpdateRandomEvents {
  serverId: string;
  randomEvents: Partial<Record<ValuesOf<typeof RPG_RANDOM_EVENTS>, string | null>>;
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
  return dbServer.findOneAndUpdate({serverId}, query, {new: true});
};

interface ISetTTVerificationChannel {
  serverId: string;
  channelId: string;
}

const setTTVerificationChannel = async ({serverId, channelId}: ISetTTVerificationChannel) => {
  const server = await dbServer.findOneAndUpdate(
    {serverId},
    {
      $set: {'settings.ttVerification.channelId': channelId},
    },
    {new: true}
  );

  return server ?? null;
};

interface IIsTTVerificationRuleExists {
  serverId: string;
  roleId: string;
}

const isTTVerificationRuleExists = async ({serverId, roleId}: IIsTTVerificationRuleExists) => {
  const server = await dbServer.findOne({
    serverId,
  });

  return server?.settings.ttVerification.rules.some((rule) => rule.roleId === roleId) ?? false;
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
  let server;
  if (!isExists) {
    server = await dbServer.findOneAndUpdate(
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
      {
        new: true,
      }
    );
  } else {
    server = await dbServer.findOneAndUpdate(
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
      {
        new: true,
      }
    );
  }
  return server ?? null;
};

interface IRemoveTTVerificationRule {
  serverId: string;
  roleId: string;
}

const removeTTVerificationRule = async ({serverId, roleId}: IRemoveTTVerificationRule) => {
  const server = await dbServer.findOneAndUpdate(
    {serverId},
    {
      $pull: {
        'settings.ttVerification.rules': {
          roleId,
        },
      },
    },
    {new: true}
  );
  return server ?? null;
};

interface IGetUserBoostedServers {
  userId: string;
}

interface IGetUserBoostedServersResponse {
  serverId: string;
  token: number;
  name: string;
}

const getUserBoostedServers = async ({userId}: IGetUserBoostedServers) => {
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
  return servers ?? [];
};

interface IAddTokens {
  serverId: string;
  userId: string;
  amount: number;
}

const addTokens = async ({serverId, userId, amount}: IAddTokens) => {
  const isUserExists = await dbServer.findOne({
    serverId,
    tokens: {
      $elemMatch: {
        userId,
      },
    },
  });
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
      }
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
      }
    );
  }
};

interface IRemoveTokens {
  serverId: string;
  userId: string;
  tokens?: number;
}

const removeTokens = async ({serverId, userId, tokens}: IRemoveTokens) => {
  const isUserExists = await dbServer.findOne({
    serverId,
    tokens: {
      $elemMatch: {
        userId,
      },
    },
  });
  if (!isUserExists) return;
  const tokenBoosted = isUserExists.tokens.find((token) => token.userId === userId)?.amount;
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
      }
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
      }
    );
  }
};

interface IAddServerAdmins {
  serverId: string;
  usersId: string[];
}

const addServerAdmins = async ({serverId, usersId}: IAddServerAdmins) => {
  const server = await dbServer.findOneAndUpdate(
    {serverId},
    {
      $addToSet: {
        'settings.admin.usersId': {
          $each: usersId,
        },
      },
    },
    {new: true}
  );
  return server ?? null;
};

interface IRemoveServerAdmins {
  serverId: string;
  usersId: string[];
}

const removeServerAdmins = async ({serverId, usersId}: IRemoveServerAdmins) => {
  const server = await dbServer.findOneAndUpdate(
    {serverId},
    {
      $pull: {
        'settings.admin.usersId': {
          $in: usersId,
        },
      },
    },
    {new: true}
  );
  return server ?? null;
};

interface IClearServerAdmins {
  serverId: string;
}

const clearServerAdmins = async ({serverId}: IClearServerAdmins) => {
  const server = await dbServer.findOneAndUpdate(
    {serverId},
    {
      $set: {
        'settings.admin.usersId': [],
      },
    },
    {new: true}
  );
  return server ?? null;
};

interface IAddServerAdminRoles {
  serverId: string;
  rolesId: string[];
}

const addServerAdminRoles = async ({serverId, rolesId}: IAddServerAdminRoles) => {
  const server = await dbServer.findOneAndUpdate(
    {serverId},
    {
      $addToSet: {
        'settings.admin.rolesId': {
          $each: rolesId,
        },
      },
    },
    {new: true}
  );
  return server ?? null;
};

interface IRemoveServerAdminRoles {
  serverId: string;
  rolesId: string[];
}

const removeServerAdminRoles = async ({serverId, rolesId}: IRemoveServerAdminRoles) => {
  const server = await dbServer.findOneAndUpdate(
    {serverId},
    {
      $pull: {
        'settings.admin.rolesId': {
          $in: rolesId,
        },
      },
    },
    {new: true}
  );
  return server ?? null;
};

interface IClearServerAdminRoles {
  serverId: string;
}

const clearServerAdminRoles = async ({serverId}: IClearServerAdminRoles) => {
  const server = await dbServer.findOneAndUpdate(
    {serverId},
    {$set: {'settings.admin.rolesId': []}},
    {new: true}
  );
  return server ?? null;
};

interface IUpdateServerToggle {
  serverId: string;
  query: UpdateQuery<IServer>;
}

const updateServerToggle = async ({serverId, query}: IUpdateServerToggle) => {
  const updatedServer = await dbServer.findOneAndUpdate({serverId}, query, {new: true});
  return updatedServer ?? null;
};

interface IResetToggle {
  serverId: string;
}

const resetServerToggle = async ({serverId}: IResetToggle) => {
  const updatedServer = await dbServer.findOneAndUpdate(
    {serverId},
    {$unset: {toggle: ''}},
    {new: true}
  );
  return updatedServer ?? null;
};

export const serverService = {
  registerServer,
  getServer,
  listRegisteredServersId,
  findServerById,
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
