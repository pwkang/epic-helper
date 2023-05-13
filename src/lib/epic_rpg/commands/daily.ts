import {Client, Embed, User} from 'discord.js';
import {saveUserDailyCooldown} from '../../../models/user-reminder/user-reminder.service';
import ms from 'ms';

const DAILY_COOLDOWN = ms('1d') - ms('10m');

interface IRpgDaily {
  client: Client;
  channelId: string;
  user: User;
  embed: Embed;
}

export default async function rpgDaily({user, client, channelId, embed}: IRpgDaily) {
  await saveUserDailyCooldown({
    userId: user.id,
    readyAt: new Date(Date.now() + DAILY_COOLDOWN),
  });
}

interface IIsRpgDailySuccess {
  embed: Embed;
  user: User;
}

export const isRpgDailySuccess = ({embed, user}: IIsRpgDailySuccess) =>
  embed.author?.name === `${user.username} — daily reward`;
