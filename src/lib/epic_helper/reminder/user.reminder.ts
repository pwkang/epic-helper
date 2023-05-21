import {Client} from 'discord.js';
import {
  deleteUserCooldowns,
  findUserReadyCommands,
} from '../../../models/user-reminder/user-reminder.service';
import {getUserAccount} from '../../../models/user/user.service';
import sendMessage from '../../discord.js/message/sendMessage';
import {getCommandStr} from '../../epic_rpg/reminders/reminders-command-name';
import ms from 'ms';
import {RPG_COMMAND_TYPE} from '../../../constants/rpg';
import {userPetReminderTimesUp} from './user-pet.reminder';

export const userReminderTimesUp = async (client: Client, userId: string) => {
  const user = await getUserAccount(userId);
  if (!user?.config?.onOff) return;
  if (!client.channels.cache.has(user.config.channel)) return;

  const readyCommands = await findUserReadyCommands(userId);

  // for (let command of readyCommands) {
  readyCommands.forEach((command) => {
    if (Date.now() - command.readyAt.getTime() > ms('5s')) return;
    if (command.type === RPG_COMMAND_TYPE.pet) {
      userPetReminderTimesUp(client, user);
      return;
    }
    const commandName = getCommandStr({
      props: command.props,
      slash: false,
      type: command.type,
    });
    sendMessage({
      client,
      channelId: user.config.channel,
      options: {
        content: `<@${userId}> **__${commandName}__** is ready!`,
      },
    });
  });
  await deleteUserCooldowns({
    userId: user.userId,
    types: readyCommands.map((cmd) => cmd.type),
  });
};
