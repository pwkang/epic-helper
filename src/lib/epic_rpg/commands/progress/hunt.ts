import {Client, Message, User} from 'discord.js';
import {HUNT_MONSTER_LIST} from '../../../../constants/monster';
import {saveUserHuntCooldown} from '../../../../models/user-reminder/user-reminder.service';
import ms from 'ms';
import {COMMAND_BASE_COOLDOWN} from '../../../../constants/command_base_cd';
import {calcReducedCd} from '../../../../utils/epic_rpg/calcReducedCd';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';

interface IRpgHunt {
  client: Client;
  channelId: string;
  author: User;
  content: Message['content'];
}

const HUNT_COOLDOWN = COMMAND_BASE_COOLDOWN.hunt;

export default async function rpgHunt({author, content}: IRpgHunt) {
  const hardMode = content.includes('(but stronger)');
  const together = content.includes('hunting together');

  const cooldown = await calcReducedCd({
    userId: author.id,
    commandType: RPG_COMMAND_TYPE.hunt,
    cooldown: HUNT_COOLDOWN,
  });
  await saveUserHuntCooldown({
    userId: author.id,
    hardMode,
    together,
    readyAt: new Date(Date.now() + cooldown),
  });
}

interface ISuccessChecker {
  content: string;
  author: User;
}

export function isRpgHuntSuccess({author, content}: ISuccessChecker) {
  return (
    content.includes(author.username) &&
    HUNT_MONSTER_LIST.some((monster) => content.includes(monster))
  );
}
