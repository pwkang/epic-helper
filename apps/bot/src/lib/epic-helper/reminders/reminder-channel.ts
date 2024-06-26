import type {Channel, Client} from 'discord.js';
import type {RPG_COMMAND_TYPE} from '@epic-helper/constants';
import djsChannelHelper from '../../discordjs/channel';
import {userChecker} from '../user-checker';
import {redisMainUsers, userService} from '@epic-helper/services';
import {broadcastEval} from '../../../utils/broadcast-eval';

interface IUpdateReminderChannel {
  client: Client;
  userId: string;
  channelId: Channel['id'];
}

export const updateReminderChannel = async ({
  client,
  channelId,
  userId,
}: IUpdateReminderChannel) => {
  const user = await userService.getUserAccount(userId);
  if (user && user.channel.all !== channelId) {
    await userService.setUserReminderChannel({
      userId,
      channelId,
      commandType: ['all'],
    });
  }
  if (!client.mainUsers.has(userId)) {
    client.mainUsers.add(userId);
    await redisMainUsers.set(client.cluster?.id, Array.from(client.mainUsers));
    await broadcastEval({
      client,
      target: 'rest',
      context: {
        userId,
      },
      fn: async (client, {userId}) => {
        if (!client.mainUsers.has(userId)) return;
        client.mainUsers.delete(userId);
        await client.utils.redis.redisMainUsers.set(client.cluster?.id, Array.from(client.mainUsers));
      },
    });
  }
};

interface IGetReminderChannel {
  userId: string;
  client: Client;
  commandType: keyof typeof RPG_COMMAND_TYPE;
}

export const getReminderChannel = async ({
  commandType,
  userId,
  client,
}: IGetReminderChannel) => {
  const settings = await userService.getUserReminderChannel({
    userId,
  });
  if (!settings) return null;
  if (!settings[commandType]) return settings.all;
  const channel = await djsChannelHelper.getChannel({
    channelId: settings[commandType],
    client,
  });
  if (!channel || !djsChannelHelper.isGuildChannel(channel)) return null;
  const isDonor = await userChecker.isDonor({
    client,
    userId,
    serverId: channel.guild.id,
  });

  return isDonor ? settings[commandType] : settings.all;
};
