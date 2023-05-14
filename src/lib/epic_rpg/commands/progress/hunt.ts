import {Client, Embed, Message, User} from 'discord.js';
import {HUNT_MONSTER_LIST} from '../../../../constants/monster';
import {saveUserHuntCooldown} from '../../../../models/user-reminder/user-reminder.service';
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

interface IIsPartnerUnderCommand {
  message: Message;
  author: User;
}

export function isPartnerUnderCommand({author, message}: IIsPartnerUnderCommand) {
  return message.mentions.has(author.id) && message.content.includes('in the middle');
}

interface IIsZombieHordeEnded {
  content: Message['content'];
  author: User;
}

export function isZombieHordeEnded({content, author}: IIsZombieHordeEnded) {
  return (
    content.includes(author.username) &&
    ['cried', 'fights the horde', 'the horde did not notice'].some((text) => content.includes(text))
  );
}

interface IIsUserEncounterZombieHorde {
  embed: Embed;
  author: User;
}

export function isUserEncounterZombieHorde({embed, author}: IIsUserEncounterZombieHorde) {
  return (
    embed.author?.name === `${author.username} — hunt` &&
    embed.description?.includes('a zombie horde coming your way')
  );
}

interface IIsUserJoinedTheHorde {
  content: Message['content'];
  author: User;
}

export function isUserJoinedTheHorde({content, author}: IIsUserJoinedTheHorde) {
  return (
    content.includes(author.username) &&
    ['pretends to be a zombie', 'area #2'].some((text) => content.includes(text))
  );
}
