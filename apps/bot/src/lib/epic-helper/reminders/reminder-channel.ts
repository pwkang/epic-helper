import type {Channel, Client} from 'discord.js';
import type {RPG_COMMAND_TYPE} from '@epic-helper/constants';
import {userService} from '../../../services/database/user.service';
import djsChannelHelper from '../../discordjs/channel';
import {userChecker} from '../user-checker';

interface IUpdateReminderChannel {
  userId: string;
  channelId: Channel['id'];
}

export const updateReminderChannel = async ({
  channelId,
  userId,
}: IUpdateReminderChannel) => {
  await userService.setUserReminderChannel({
    userId,
    channelId,
    commandType: ['all'],
  });
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
  if (!channel || !channel.isTextBased() || !channel.isThread())
    return settings.all;
  const isDonor = await userChecker.isDonor({
    client,
    userId,
    serverId: channel.guild.id,
  });

  return isDonor ? settings[commandType] : settings.all;
};
