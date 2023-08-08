import {
  BOT_REMINDER_BASE_COOLDOWN,
  RPG_COMMAND_TYPE,
  RPG_COOLDOWN_EMBED_TYPE,
} from '@epic-helper/constants';
import {Client, Embed, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {updateReminderChannel} from '../../../epic-helper/reminders/reminder-channel';
import {calcCdReduction} from '../../../epic-helper/reminders/commands-cooldown';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import toggleUserChecker from '../../../epic-helper/toggle-checker/user';

const DAILY_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.daily;

interface IRpgDaily {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgDaily({client, message, author, isSlashCommand}: IRpgDaily) {
  if (!message.inGuild()) return;
  const event = createRpgCommandListener({
    author,
    channelId: message.channel.id,
    client,
    commandType: RPG_COOLDOWN_EMBED_TYPE.daily,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isRpgDailySuccess({embed, author})) {
      await rpgDailySuccess({
        embed,
        author,
        channelId: message.channel.id,
        client,
      });
      await updateReminderChannel({
        userId: author.id,
        channelId: message.channel.id,
      });
      event.stop();
    }
  });
  event.on('cooldown', async (cooldown) => {
    await userReminderServices.updateUserCooldown({
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
  const toggleChecker = await toggleUserChecker({userId: author.id});
  if (!toggleChecker) return;

  if (toggleChecker.reminder.daily) {
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

  await updateReminderChannel({
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
