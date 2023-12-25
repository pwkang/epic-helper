import type {Client, Embed, Message, User} from 'discord.js';
import ms from 'ms';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {RPG_COMMAND_TYPE, RPG_COOLDOWN_EMBED_TYPE} from '@epic-helper/constants';
import {calcCdReduction} from '../../../epic-helper/reminders/commands-cooldown';
import {updateReminderChannel} from '../../../epic-helper/reminders/reminder-channel';
import {userReminderServices} from '@epic-helper/services';
import toggleUserChecker from '../../../epic-helper/toggle-checker/user';

const WEEKLY_COOLDOWN = ms('1w') - ms('10m');

interface IRpgWeekly {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgWeekly({
  client,
  message,
  author,
  isSlashCommand,
}: IRpgWeekly) {
  if (!message.inGuild()) return;
  let event = createRpgCommandListener({
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
        client,
        message,
      });
      event?.stop();
    }
  });
  event.on('cooldown', async (cooldown) => {
    const toggleUser = await toggleUserChecker({
      userId: author.id,
      serverId: message.guild.id,
      client,
    });
    if (!toggleUser?.reminder.weekly) return;
    await userReminderServices.updateUserCooldown({
      userId: author.id,
      readyAt: new Date(Date.now() + cooldown),
      type: RPG_COMMAND_TYPE.weekly,
    });
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgWeeklySuccess {
  client: Client;
  author: User;
  embed: Embed;
  message: Message<true>;
}

const rpgWeeklySuccess = async ({
  author,
  message,
  client,
}: IRpgWeeklySuccess) => {
  const toggleChecker = await toggleUserChecker({
    userId: author.id,
    client,
    serverId: message.guild.id,
  });
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
    client,
    userId: author.id,
    channelId: message.channelId,
  });
};

interface IIsRpgWeeklySuccess {
  embed: Embed;
  author: User;
}

const isRpgWeeklySuccess = ({embed, author}: IIsRpgWeeklySuccess) =>
  embed.author?.name === `${author.username} — weekly reward`;
