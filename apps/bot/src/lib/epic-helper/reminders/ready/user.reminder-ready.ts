import type {Client} from 'discord.js';
import ms from 'ms';
import {userPetReminderTimesUp} from './user-pet.reminder-ready';
import {getReminderChannel} from '../reminder-channel';
import {djsMessageHelper} from '../../../discordjs/message';
import {RPG_COMMAND_TYPE} from '@epic-helper/constants';
import {redisMainUsers, userReminderServices, userService} from '@epic-helper/services';
import {generateUserReminderMessage} from '../message-generator/custom-message-generator';
import {djsUserHelper} from '../../../discordjs/user';
import toggleUserChecker from '../../toggle-checker/user';
import djsChannelHelper from '../../../discordjs/channel';

export const userReminderTimesUp = async (client: Client, userId: string) => {
  const userAccount = await userService.getUserAccount(userId);
  if (!userAccount?.config?.onOff) return;
  const defaultChannel = userAccount.channel.all;
  if (!client.channels.cache.has(defaultChannel)) {
    if (client.mainUsers.has(userId)) {
      client.mainUsers.delete(userId);
      await redisMainUsers.set(client.cluster?.id, Array.from(client.mainUsers));
    }
    return;
  }

  const readyCommands = await userReminderServices.findUserReadyCommands(
    userId,
  );
  await userReminderServices.updateRemindedCooldowns({
    userId: userAccount.userId,
    types: readyCommands.map((cmd) => cmd.type),
  });
  for (const command of readyCommands) {
    if (command.readyAt && Date.now() - command.readyAt.getTime() > ms('5s')) continue;

    if (command.type === RPG_COMMAND_TYPE.pet) {
      return userPetReminderTimesUp({
        userReminder: command,
        userAccount,
        client,
      });
    }
    const channelId = await getReminderChannel({
      commandType: command.type,
      userId: userAccount.userId,
      client,
    });
    if (!channelId) continue;
    const channel = await djsChannelHelper.getChannel({
      channelId,
      client,
    });
    if (!channel) continue;
    if (!djsChannelHelper.isGuildChannel(channel)) continue;

    const toggleChecker = await toggleUserChecker({
      userId,
      client,
      serverId: channel.guild.id,
    });
    if (!toggleChecker) continue;
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
};
