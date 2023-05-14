import {Client, Embed, User} from 'discord.js';
import {saveUserDailyCooldown} from '../../../../models/user-reminder/user-reminder.service';
import ms from 'ms';
import {COMMAND_BASE_COOLDOWN} from '../../../../constants/command_base_cd';
import {calcReducedCd} from '../../../../utils/epic_rpg/calcReducedCd';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';

const DAILY_COOLDOWN = COMMAND_BASE_COOLDOWN.daily;

interface IRpgDaily {
  client: Client;
  channelId: string;
  author: User;
  embed: Embed;
}

export default async function rpgDaily({author}: IRpgDaily) {
  const cooldown = await calcReducedCd({
    userId: author.id,
    commandType: RPG_COMMAND_TYPE.daily,
    cooldown: DAILY_COOLDOWN,
  });
  await saveUserDailyCooldown({
    userId: author.id,
    readyAt: new Date(Date.now() + cooldown),
  });
}

interface IIsRpgDailySuccess {
  embed: Embed;
  user: User;
}

export const isRpgDailySuccess = ({embed, user}: IIsRpgDailySuccess) =>
  embed.author?.name === `${user.username} — daily reward`;
