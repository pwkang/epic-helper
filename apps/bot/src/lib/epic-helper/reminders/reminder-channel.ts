import type {Channel, Client} from 'discord.js';
import type {RPG_COMMAND_TYPE} from '@epic-helper/constants';
import {userService} from '../../../services/database/user.service';

interface IUpdateReminderChannel {
  userId: string;
  channelId: Channel['id'];
}

export const updateReminderChannel = async ({
  channelId,
  userId
}: IUpdateReminderChannel) => {
  await userService.setUserReminderChannel({
    userId,
    channelId,
    commandType: ['all']
  });
};

interface IGetReminderChannel {
  userId: string;
  client: Client;
  commandType: keyof typeof RPG_COMMAND_TYPE;
}

export const getReminderChannel = async ({
  commandType,
  userId
}: IGetReminderChannel) => {
  const settings = await userService.getUserReminderChannel({
    userId
  });
  if (!settings) return null;
  return settings[commandType] ?? settings.all;
};
