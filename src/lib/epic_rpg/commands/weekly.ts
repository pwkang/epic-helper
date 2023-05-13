import {Client, Embed, User} from 'discord.js';
import {saveUserWeeklyCooldown} from '../../../models/user-reminder/user-reminder.service';
import ms from 'ms';

const WEEKLY_COOLDOWN = ms('1d') - ms('10m');

interface IRpgWeekly {
  client: Client;
  channelId: string;
  user: User;
  embed: Embed;
}

export default async function rpgWeekly({user}: IRpgWeekly) {
  await saveUserWeeklyCooldown({
    userId: user.id,
    readyAt: new Date(Date.now() + WEEKLY_COOLDOWN),
  });
}

interface IIsRpgWeeklySuccess {
  embed: Embed;
  user: User;
}

export const isRpgWeeklySuccess = ({embed, user}: IIsRpgWeeklySuccess) =>
  embed.author?.name === `${user.username} — weekly reward`;
