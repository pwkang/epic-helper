import {mongoClient} from '@epic-helper/services';
import {IEnchantChannel, IServer, serverSchema} from '@epic-helper/models';
import {RPG_COMMAND_TYPE, RPG_RANDOM_EVENTS} from '@epic-helper/constants';
import {UpdateQuery} from 'mongoose';
import {typedObjectEntries} from '../../utils/typed-object-entries';

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

  if (!server) {
    return null;
  }
  return server;
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
};
