import {Client, Embed, Message, User} from 'discord.js';
import {
  saveUserWeeklyCooldown,
  updateUserCooldown,
} from '../../../../models/user-reminder/user-reminder.service';
import ms from 'ms';
import {calcReducedCd} from '../../../../utils/epic_rpg/calcReducedCd';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';
import {createRpgCommandListener} from '../../createRpgCommandListener';

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
      userId: message.author.id,
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

export default async function rpgWeeklySuccess({author}: IRpgWeeklySuccess) {
  const cooldown = await calcReducedCd({
    userId: author.id,
    commandType: RPG_COMMAND_TYPE.weekly,
    cooldown: WEEKLY_COOLDOWN,
  });
  await saveUserWeeklyCooldown({
    userId: author.id,
    readyAt: new Date(Date.now() + cooldown),
  });
}

interface IIsRpgWeeklySuccess {
  embed: Embed;
  author: User;
}

export const isRpgWeeklySuccess = ({embed, author}: IIsRpgWeeklySuccess) =>
  embed.author?.name === `${author.username} — weekly reward`;
