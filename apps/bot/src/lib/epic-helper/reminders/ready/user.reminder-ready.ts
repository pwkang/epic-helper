import {Client} from 'discord.js';
import ms from 'ms';
import {userPetReminderTimesUp} from './user-pet.reminder-ready';
import {getReminderChannel} from '../reminder-channel';
import {djsMessageHelper} from '../../../discordjs/message';
import {RPG_COMMAND_TYPE} from '@epic-helper/constants';
import {userService} from '../../../../services/database/user.service';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import {generateUserReminderMessage} from '../message-generator/custom-message-generator';

export const userReminderTimesUp = async (client: Client, userId: string) => {
  const user = await userService.getUserAccount(userId);
  if (!user?.config?.onOff) return;

  const readyCommands = await userReminderServices.findUserReadyCommands(userId);
  for (let command of readyCommands) {
    if (Date.now() - command.readyAt.getTime() > ms('5s')) {
      await userReminderServices.deleteUserCooldowns({
        userId: user.userId,
        types: [command.type],
      });
      continue;
    }

    if (command.type === RPG_COMMAND_TYPE.pet) {
      return userPetReminderTimesUp(client, user);
    }

    const channelId = await getReminderChannel({
      commandType: command.type,
      userId: user.userId,
      client,
    });
    if (!channelId || !client.channels.cache.has(channelId)) return;

    const nextReminder = await userReminderServices.getNextReadyCommand({
      userId,
    });

    const reminderMessage = await generateUserReminderMessage({
      client,
      userId,
      userAccount: user,
      props: command.props,
      type: command.type,
      nextReminder: nextReminder ?? undefined,
    });
    await djsMessageHelper.send({
      client,
      channelId,
      options: {
        content: reminderMessage,
      },
    });
  }
  await userReminderServices.deleteUserCooldowns({
    userId: user.userId,
    types: readyCommands.map((cmd) => cmd.type),
  });
};
