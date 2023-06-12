import {Channel, Client} from 'discord.js';
import {RPG_COMMAND_TYPE} from '../constants/epic_rpg/rpg';
import {getUserReminderChannel, setUserReminderChannel} from '../models/user/user.service';

interface IUpdateReminderChannel {
  userId: string;
  channelId: Channel['id'];
}

export const updateReminderChannel = async ({channelId, userId}: IUpdateReminderChannel) => {
  await setUserReminderChannel({
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

export const getReminderChannel = async ({commandType, userId}: IGetReminderChannel) => {
  const settings = await getUserReminderChannel({
    userId,
  });
  if (!settings) return null;
  return settings[commandType] ?? settings.all;
};
