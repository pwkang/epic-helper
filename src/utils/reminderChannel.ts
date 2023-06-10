import {Channel, Client, User} from 'discord.js';
import {RPG_COMMAND_TYPE} from '../constants/rpg';
import {getUserReminderChannel, setUserReminderChannel} from '../models/user/user.service';
import {set} from 'mongoose';

interface IUpdateReminderChannel {
  userId: string;
  channelId: Channel['id'];
}

export const updateReminderChannel = async ({channelId, userId}: IUpdateReminderChannel) => {
  await setUserReminderChannel({
    userId,
    channelId,
    commandType: 'all',
  });
};

interface IGetReminderChannel {
  author: User;
  client: Client;
  commandType: keyof typeof RPG_COMMAND_TYPE;
}

export const getReminderChannel = async ({commandType, author, client}: IGetReminderChannel) => {
  const settings = await getUserReminderChannel({
    userId: author.id,
  });
  if (!settings) return null;
  return settings[commandType] ?? settings.all;
};
