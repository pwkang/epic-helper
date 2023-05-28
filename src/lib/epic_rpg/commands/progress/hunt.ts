import {Client, Embed, Message, User} from 'discord.js';
import {HUNT_MONSTER_LIST} from '../../../../constants/monster';
import {
  saveUserHuntCooldown,
  updateUserCooldown,
} from '../../../../models/user-reminder/user-reminder.service';
import {COMMAND_BASE_COOLDOWN} from '../../../../constants/command_base_cd';
import {calcReducedCd} from '../../../../utils/epic_rpg/calcReducedCd';
import {DONOR_CD_REDUCTION, RPG_COMMAND_TYPE} from '../../../../constants/rpg';
import {createRpgCommandListener} from '../../createRpgCommandListener';
import replyMessage from '../../../discord.js/message/replyMessage';
import {getUserAccount} from '../../../../models/user/user.service';
import {calcDonorPExtraHuntCd} from '../../../epic_helper/reminder/calcHuntCdWithDonorP';

interface IRpgHunt {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand?: boolean;
}

export function rpgHunt({author, message, client, isSlashCommand}: IRpgHunt) {
  const event = createRpgCommandListener({
    client,
    channelId: message.channel.id,
    author,
  });
  if (!event) return;
  event.on('content', (content) => {
    if (isRpgHuntSuccess({author, content}) || isZombieHordeEnded({author, content})) {
      rpgHuntSuccess({
        client,
        channelId: message.channel.id,
        author,
        content,
      });
      event.stop();
    }

    if (isUserJoinedTheHorde({author, content})) {
      replyMessage({
        message,
        client,
        options: {
          content: `You were moved to area 2, remember to go back your area!`,
        },
      });
    }

    if (isPartnerUnderCommand({author, message})) event.stop();
  });
  event.on('embed', (embed) => {
    if (isUserEncounterZombieHorde({author, embed})) {
      event.resetTimer(20000);
      event.pendingAnswer();
    }
  });
  event.on('cooldown', (cooldown) => {
    updateUserCooldown({
      userId: author.id,
      type: RPG_COMMAND_TYPE.hunt,
      readyAt: new Date(Date.now() + cooldown),
    });
    event.stop();
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgHuntSuccess {
  client: Client;
  channelId: string;
  author: User;
  content: Message['content'];
}

const HUNT_COOLDOWN = COMMAND_BASE_COOLDOWN.hunt;

export default async function rpgHuntSuccess({author, content}: IRpgHuntSuccess) {
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
