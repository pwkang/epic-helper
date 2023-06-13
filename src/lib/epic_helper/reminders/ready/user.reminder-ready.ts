import {Client} from 'discord.js';
import {
  deleteUserCooldowns,
  findUserReadyCommands,
} from '../../../../models/user-reminder/user-reminder.service';
import {getUserAccount} from '../../../../models/user/user.service';
import {getCommandStr} from '../reminders-command-name';
import ms from 'ms';
import {RPG_COMMAND_TYPE} from '../../../../constants/epic_rpg/rpg';
import {userPetReminderTimesUp} from './user-pet.reminder-ready';
import {getReminderChannel} from '../reminderChannel';
import {djsMessageHelper} from '../../../discord.js/message';

export const userReminderTimesUp = async (client: Client, userId: string) => {
  const user = await getUserAccount(userId);
  if (!user?.config?.onOff) return;

  const readyCommands = await findUserReadyCommands(userId);

  for (let command of readyCommands) {
    if (Date.now() - command.readyAt.getTime() > ms('5s')) return;

    if (command.type === RPG_COMMAND_TYPE.pet) {
      return userPetReminderTimesUp(client, user);
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
    djsMessageHelper.send({
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
