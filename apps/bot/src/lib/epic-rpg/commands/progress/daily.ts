import {BOT_REMINDER_BASE_COOLDOWN, RPG_COMMAND_TYPE} from '@epic-helper/constants';
import {Client, Embed, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {updateReminderChannel} from '../../../epic-helper/reminders/reminder-channel';
import {calcCdReduction} from '../../../epic-helper/reminders/commands-cooldown';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import {userService} from '../../../../services/database/user.service';

const DAILY_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.daily;

interface IRpgDaily {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgDaily({client, message, author, isSlashCommand}: IRpgDaily) {
  const event = createRpgCommandListener({
    author,
    channelId: message.channel.id,
    client,
  });
  if (!event) return;
  event.on('embed', (embed) => {
    if (isRpgDailySuccess({embed, author})) {
      rpgDailySuccess({
        embed,
        author,
        channelId: message.channel.id,
        client,
      });
      updateReminderChannel({
        userId: author.id,
        channelId: message.channel.id,
      });
      event.stop();
    }
  });
  event.on('cooldown', (cooldown) => {
    userReminderServices.updateUserCooldown({
      userId: author.id,
      readyAt: new Date(Date.now() + cooldown),
      type: RPG_COMMAND_TYPE.daily,
    });
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgDailySuccess {
  client: Client;
  channelId: string;
  author: User;
  embed: Embed;
}

const rpgDailySuccess = async ({author, channelId}: IRpgDailySuccess) => {
  const userAccount = (await userService.getUserAccount(author.id))!;

  if (userAccount.toggle.reminder.all && userAccount.toggle.reminder.daily) {
    const cooldown = await calcCdReduction({
      userId: author.id,
      commandType: RPG_COMMAND_TYPE.daily,
      cooldown: DAILY_COOLDOWN,
    });
    await userReminderServices.saveUserDailyCooldown({
      userId: author.id,
      readyAt: new Date(Date.now() + cooldown),
    });
  }

  updateReminderChannel({
    userId: author.id,
    channelId,
  });
};

interface IIsRpgDailySuccess {
  embed: Embed;
  author: User;
}

const isRpgDailySuccess = ({embed, author}: IIsRpgDailySuccess) =>
  embed.author?.name === `${author.username} — daily reward`;
