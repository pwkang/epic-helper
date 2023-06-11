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
import {getReminderChannel} from '../../../utils/reminderChannel';

export const userReminderTimesUp = async (client: Client, userId: string) => {
  const user = await getUserAccount(userId);
  if (!user?.config?.onOff) return;

  const readyCommands = await findUserReadyCommands(userId);

  for (let command of readyCommands) {
    if (Date.now() - command.readyAt.getTime() > ms('5s')) return;
    
    if (command.type === RPG_COMMAND_TYPE.pet) {
      userPetReminderTimesUp(client, user);
      return;
    }

    const channelId = await getReminderChannel({
      commandType: command.type,
      userId: user.userId,
      client,
    });
    if (!channelId || !client.channels.cache.has(channelId)) return;

    const commandName = getCommandStr({
      props: command.props,
      slash: false,
      type: command.type,
    });
    sendMessage({
      client,
      channelId,
      options: {
        content: `<@${userId}> **__${commandName}__** is ready!`,
      },
    });
  }
  await deleteUserCooldowns({
    userId: user.userId,
    types: readyCommands.map((cmd) => cmd.type),
  });
};
