import {Client} from 'discord.js';
import ms from 'ms';
import {userPetReminderTimesUp} from './user-pet.reminder-ready';
import {getReminderChannel} from '../reminder-channel';
import {djsMessageHelper} from '../../../discordjs/message';
import {RPG_COMMAND_TYPE} from '@epic-helper/constants';
import {userService} from '../../../../services/database/user.service';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import {generateUserReminderMessage} from '../message-generator/custom-message-generator';
import {djsUserHelper} from '../../../discordjs/user';
import toggleUserChecker from '../../toggle-checker/user';

export const userReminderTimesUp = async (client: Client, userId: string) => {
  const userAccount = await userService.getUserAccount(userId);
  if (!userAccount?.config?.onOff) return;

  const toggleChecker = await toggleUserChecker({userId});
  if (!toggleChecker) return;

  const readyCommands = await userReminderServices.findUserReadyCommands(userId);
  for (let command of readyCommands) {
    if (command.readyAt && Date.now() - command.readyAt.getTime() > ms('5s')) {
      await userReminderServices.updateRemindedCooldowns({
        userId: userAccount.userId,
        types: [command.type],
      });
      continue;
    }

    if (command.type === RPG_COMMAND_TYPE.pet) {
      return userPetReminderTimesUp({
        userReminder: command,
        userAccount,
        toggleChecker,
        client,
      });
    }

    const channelId = await getReminderChannel({
      commandType: command.type,
      userId: userAccount.userId,
      client,
    });
    if (!channelId || !client.channels.cache.has(channelId)) continue;
    if (!toggleChecker.reminder[command.type]) continue;

    const nextReminder = await userReminderServices.getNextReadyCommand({
      userId,
    });

    const reminderMessage = generateUserReminderMessage({
      client,
      userId,
      userAccount: userAccount,
      type: command.type,
      nextReminder: nextReminder ?? undefined,
      userReminder: command,
      toggleChecker,
    });
    if (toggleChecker.dm[command.type]) {
      await djsUserHelper.sendDm({
        client,
        userId,
        options: {
          content: reminderMessage,
        },
      });
    } else {
      await djsMessageHelper.send({
        client,
        channelId,
        options: {
          content: reminderMessage,
        },
      });
    }
  }
  await userReminderServices.updateRemindedCooldowns({
    userId: userAccount.userId,
    types: readyCommands.map((cmd) => cmd.type),
  });
};
