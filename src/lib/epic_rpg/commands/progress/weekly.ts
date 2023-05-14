import {Client, Embed, User} from 'discord.js';
import {saveUserWeeklyCooldown} from '../../../../models/user-reminder/user-reminder.service';
import ms from 'ms';
import {calcReducedCd} from '../../../../utils/epic_rpg/calcReducedCd';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';

const WEEKLY_COOLDOWN = ms('1w') - ms('10m');

interface IRpgWeekly {
  client: Client;
  channelId: string;
  author: User;
  embed: Embed;
}

export default async function rpgWeekly({author}: IRpgWeekly) {
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
  user: User;
}

export const isRpgWeeklySuccess = ({embed, user}: IIsRpgWeeklySuccess) =>
  embed.author?.name === `${user.username} — weekly reward`;
