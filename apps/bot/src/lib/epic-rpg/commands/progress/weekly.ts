import {Client, Embed, Message, User} from 'discord.js';
import ms from 'ms';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {RPG_COMMAND_TYPE, RPG_COOLDOWN_EMBED_TYPE} from '@epic-helper/constants';
import {calcCdReduction} from '../../../epic-helper/reminders/commands-cooldown';
import {updateReminderChannel} from '../../../epic-helper/reminders/reminder-channel';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import toggleUserChecker from '../../../epic-helper/toggle-checker/user';

const WEEKLY_COOLDOWN = ms('1w') - ms('10m');

interface IRpgWeekly {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgWeekly({client, message, author, isSlashCommand}: IRpgWeekly) {
  const event = createRpgCommandListener({
    author,
    channelId: message.channel.id,
    client,
    commandType: RPG_COOLDOWN_EMBED_TYPE.weekly,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isRpgWeeklySuccess({embed, author})) {
      await rpgWeeklySuccess({
        embed,
        author,
        channelId: message.channel.id,
        client,
      });
      event.stop();
    }
  });
  event.on('cooldown', async (cooldown) => {
    await userReminderServices.updateUserCooldown({
      userId: author.id,
      readyAt: new Date(Date.now() + cooldown),
      type: RPG_COMMAND_TYPE.weekly,
    });
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgWeeklySuccess {
  client: Client;
  channelId: string;
  author: User;
  embed: Embed;
}

const rpgWeeklySuccess = async ({author, channelId}: IRpgWeeklySuccess) => {
  const toggleChecker = await toggleUserChecker({userId: author.id});
  if (!toggleChecker) return;

  if (toggleChecker.reminder.weekly) {
    const cooldown = await calcCdReduction({
      userId: author.id,
      commandType: RPG_COMMAND_TYPE.weekly,
      cooldown: WEEKLY_COOLDOWN,
    });
    await userReminderServices.saveUserWeeklyCooldown({
      userId: author.id,
      readyAt: new Date(Date.now() + cooldown),
    });
  }

  await updateReminderChannel({
    userId: author.id,
    channelId,
  });
};

interface IIsRpgWeeklySuccess {
  embed: Embed;
  author: User;
}

const isRpgWeeklySuccess = ({embed, author}: IIsRpgWeeklySuccess) =>
  embed.author?.name === `${author.username} — weekly reward`;
