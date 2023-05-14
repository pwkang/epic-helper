import {Client, Embed, User} from 'discord.js';
import {saveUserDailyCooldown} from '../../../../models/user-reminder/user-reminder.service';
import ms from 'ms';
import {COMMAND_BASE_COOLDOWN} from '../../../../constants/command_base_cd';

const DAILY_COOLDOWN = COMMAND_BASE_COOLDOWN.daily;

interface IRpgDaily {
  client: Client;
  channelId: string;
  user: User;
  embed: Embed;
}

export default async function rpgDaily({user}: IRpgDaily) {
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
