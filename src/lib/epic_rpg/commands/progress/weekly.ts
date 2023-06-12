import {Client, Embed, Message, User} from 'discord.js';
import {
  saveUserWeeklyCooldown,
  updateUserCooldown,
} from '../../../../models/user-reminder/user-reminder.service';
import ms from 'ms';
import {calcCdReduction} from '../../../epic_helper/reminders/commandsCooldown';
import {RPG_COMMAND_TYPE} from '../../../../constants/epic_rpg/rpg';
import {createRpgCommandListener} from '../../createRpgCommandListener';
import {updateReminderChannel} from '../../../epic_helper/reminders/reminderChannel';

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
  });
  if (!event) return;
  event.on('embed', (embed) => {
    if (isRpgWeeklySuccess({embed, author})) {
      rpgWeeklySuccess({
        embed,
        author,
        channelId: message.channel.id,
        client,
      });
      event.stop();
    }
  });
  event.on('cooldown', (cooldown) => {
    updateUserCooldown({
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

export default async function rpgWeeklySuccess({author, channelId}: IRpgWeeklySuccess) {
  const cooldown = await calcCdReduction({
    userId: author.id,
    commandType: RPG_COMMAND_TYPE.weekly,
    cooldown: WEEKLY_COOLDOWN,
  });
  await saveUserWeeklyCooldown({
    userId: author.id,
    readyAt: new Date(Date.now() + cooldown),
  });
  updateReminderChannel({
    userId: author.id,
    channelId,
  });
}

interface IIsRpgWeeklySuccess {
  embed: Embed;
  author: User;
}

export const isRpgWeeklySuccess = ({embed, author}: IIsRpgWeeklySuccess) =>
  embed.author?.name === `${author.username} — weekly reward`;
