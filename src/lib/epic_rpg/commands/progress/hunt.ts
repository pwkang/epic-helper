import {Client, Embed, Message, User} from 'discord.js';
import {HUNT_MONSTER_LIST} from '../../../../constants/epic_rpg/monster';
import {
  saveUserHuntCooldown,
  updateUserCooldown,
} from '../../../../models/user-reminder/user-reminder.service';
import {BOT_REMINDER_BASE_COOLDOWN} from '../../../../constants/epic_helper/command_base_cd';
import {calcReducedCd} from '../../../../utils/epic_rpg/calcReducedCd';
import {RPG_COMMAND_TYPE} from '../../../../constants/epic_rpg/rpg';
import {createRpgCommandListener} from '../../createRpgCommandListener';
import replyMessage from '../../../discord.js/message/replyMessage';
import {getUserHealReminder} from '../../../../models/user/user.service';
import {RPG_CLICKABLE_SLASH_COMMANDS} from '../../../../constants/epic_rpg/clickable_slash';
import sendMessage from '../../../discord.js/message/sendMessage';
import {updateReminderChannel} from '../../../../utils/reminderChannel';
import {countUserStats} from '../../../../models/user-stats/user-stats.service';
import {USER_STATS_RPG_COMMAND_TYPE} from '../../../../models/user-stats/user-stats.types';
import ms from 'ms';

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

    if (isRpgHuntSuccess({author, content})) {
      healReminder({
        client,
        author,
        content,
        channelId: message.channel.id,
      });
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

    if (isPartnerUnderCommand({author, message}) || isHardModeNotUnlocked({content})) event.stop();
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

const HUNT_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.hunt;

async function rpgHuntSuccess({author, content, channelId}: IRpgHuntSuccess) {
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
  updateReminderChannel({
    userId: author.id,
    channelId,
  });

  countUserStats({
    userId: author.id,
    type: together ? USER_STATS_RPG_COMMAND_TYPE.huntTogether : USER_STATS_RPG_COMMAND_TYPE.hunt,
  });
}

interface IHealReminder {
  client: Client;
  channelId: string;
  author: User;
  content: Message['content'];
}

async function healReminder({client, channelId, author, content}: IHealReminder) {
  const together = content.includes('hunting together');
  const healReminder = await getUserHealReminder({
    userId: author.id,
  });
  if (!healReminder) return;
  const healReminderMsg = await getHealReminderMsg({
    content,
    author,
    together,
    target: healReminder,
  });
  if (!healReminderMsg) return;
  sendMessage({
    channelId,
    options: {
      content: author + healReminderMsg,
    },
    client,
  });
}

interface ISuccessChecker {
  content: string;
  author: User;
}

function isRpgHuntSuccess({author, content}: ISuccessChecker) {
  return (
    content.includes(author.username) &&
    HUNT_MONSTER_LIST.some((monster) => content.includes(monster))
  );
}

interface IIsHardModeNotUnlocked {
  content: string;
}

const isHardModeNotUnlocked = ({content}: IIsHardModeNotUnlocked) =>
  content.includes('This command is unlocked in the');

interface IIsPartnerUnderCommand {
  message: Message;
  author: User;
}

function isPartnerUnderCommand({author, message}: IIsPartnerUnderCommand) {
  return message.mentions.has(author.id) && message.content.includes('in the middle');
}

interface IIsZombieHordeEnded {
  content: Message['content'];
  author: User;
}

function isZombieHordeEnded({content, author}: IIsZombieHordeEnded) {
  return (
    content.includes(author.username) &&
    ['cried', 'fights the horde', 'the horde did not notice'].some((text) => content.includes(text))
  );
}

interface IIsUserEncounterZombieHorde {
  embed: Embed;
  author: User;
}

function isUserEncounterZombieHorde({embed, author}: IIsUserEncounterZombieHorde) {
  return (
    embed.author?.name === `${author.username} — hunt` &&
    embed.description?.includes('a zombie horde coming your way')
  );
}

interface IIsUserJoinedTheHorde {
  content: Message['content'];
  author: User;
}

function isUserJoinedTheHorde({content, author}: IIsUserJoinedTheHorde) {
  return (
    content.includes(author.username) &&
    ['pretends to be a zombie', 'area #2'].some((text) => content.includes(text))
  );
}

interface IGetHealReminderMsg {
  content: Message['content'];
  author: User;
  together: boolean;
  target: number | undefined;
}

export function getHealReminderMsg({
  content,
  author,
  together,
  target,
}: IGetHealReminderMsg): string | void {
  let hp: string | undefined;
  let partnerSaved: boolean | undefined = false;
  let hpLost: string | undefined;
  let horseSaved: boolean | undefined = false;
  let dead: boolean | undefined = false;
  if (!together) {
    if (content.includes('found and killed a')) {
      //player survived
      hp = content
        .split('\n')
        .find((msg) => msg.includes('remaining HP'))
        ?.split('HP is')[1]
        .trim()
        .split('/')[0];
      hpLost = content
        .split('\n')
        .find((msg) => msg.includes('remaining HP'))
        ?.split('HP')[0]
        .trim()
        .split(' ')
        .pop();
    } else if (content.includes('lost fighting')) {
      //player died
      dead = true;
      if (content.includes('saved you before the enemy')) horseSaved = true;
    }
  } else if (together) {
    if (content.includes('Both enemies were killed')) {
      //Both Enemy were Killed
      hp = content
        .split('\n')
        .find((msg) => [author.username, 'remaining HP is'].every((m) => msg.includes(m)))
        ?.split('HP is')[1]
        .trim()
        .split('/')[0];
      hpLost = content
        .split('\n')
        .find((msg) => [author.username, 'remaining HP is'].every((m) => msg.includes(m)))
        ?.split('HP')[0]
        .trim()
        .split(' ')
        .pop();
    } else if (content.includes('just in time')) {
      //one of the player died
      let playerSurvived = content
        .split('\n')
        .find((msg) => [author.username, 'remaining HP is'].every((m) => msg.includes(m)));
      if (playerSurvived) {
        //player is survived
        hp = playerSurvived.split('HP is')[1].trim().split('/')[0];
      } else {
        //player dead but saved
        dead = true;
        partnerSaved = true;
      }
    } else if (content.includes('but they saved each other')) {
      //both player died
      dead = true;
      partnerSaved = true;
    }
  }
  let msg;
  if (horseSaved) {
    msg = `Your horse saved you from dying, ${RPG_CLICKABLE_SLASH_COMMANDS.heal} yourself now`;
  } else if (Number(hpLost) && Number(hpLost) >= Number(hp)) {
    msg = `It's hard to kill the next monster, Time to ${RPG_CLICKABLE_SLASH_COMMANDS.heal} now`;
  } else if (dead) {
    if (partnerSaved) {
      msg = `You were killed by a monster, but your partner saved you, ${RPG_CLICKABLE_SLASH_COMMANDS.heal} yourself now`;
    } else {
      return;
    }
  } else if (hpLost && Number(hpLost) !== 0) {
    // user is damaged
    if (target && Number(hp) <= Number(target))
      msg = `Your HP is getting low. Time to ${RPG_CLICKABLE_SLASH_COMMANDS.heal} now`;
  }
  return msg;
}
