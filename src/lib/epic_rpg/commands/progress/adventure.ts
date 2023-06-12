import {Client, Message, User} from 'discord.js';
import {ADVENTURE_MONSTER_LIST} from '../../../../constants/epic_rpg/monster';
import {
  saveUserAdventureCooldown,
  updateUserCooldown,
} from '../../../../models/user-reminder/user-reminder.service';
import {BOT_REMINDER_BASE_COOLDOWN} from '../../../../constants/epic_helper/command_base_cd';
import {calcCdReduction} from '../../../epic_helper/reminders/commandsCooldown';
import {RPG_COMMAND_TYPE} from '../../../../constants/epic_rpg/rpg';
import {createRpgCommandListener} from '../../createRpgCommandListener';
import {RPG_CLICKABLE_SLASH_COMMANDS} from '../../../../constants/epic_rpg/clickable_slash';
import {getUserHealReminder} from '../../../../models/user/user.service';
import sendMessage from '../../../discord.js/message/sendMessage';
import {updateReminderChannel} from '../../../epic_helper/reminders/reminderChannel';
import {countUserStats} from '../../../../models/user-stats/user-stats.service';
import {USER_STATS_RPG_COMMAND_TYPE} from '../../../../models/user-stats/user-stats.types';

interface IRpgAdventure {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgAdventure({client, message, author, isSlashCommand}: IRpgAdventure) {
  const event = createRpgCommandListener({
    channelId: message.channel.id,
    author,
    client,
  });
  if (!event) return;
  event.on('content', (content) => {
    if (isRpgAdventureSuccess({author, content})) {
      rpgAdventureSuccess({
        author,
        client,
        channelId: message.channel.id,
        content,
      });
      healReminder({
        client,
        author,
        content,
        channelId: message.channel.id,
      });
      event.stop();
    }
  });
  event.on('cooldown', (cooldown) => {
    updateUserCooldown({
      userId: author.id,
      type: RPG_COMMAND_TYPE.adventure,
      readyAt: new Date(Date.now() + cooldown),
    });
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgAdventureSuccess {
  client: Client;
  channelId: string;
  author: User;
  content: Message['content'];
}

const ADVENTURE_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.adventure;

export default async function rpgAdventureSuccess({
  author,
  content,
  channelId,
}: IRpgAdventureSuccess) {
  const hardMode = content.includes('(but stronger)');

  const cooldown = await calcCdReduction({
    userId: author.id,
    commandType: RPG_COMMAND_TYPE.adventure,
    cooldown: ADVENTURE_COOLDOWN,
  });
  await saveUserAdventureCooldown({
    userId: author.id,
    hardMode,
    readyAt: new Date(Date.now() + cooldown),
  });

  updateReminderChannel({
    userId: author.id,
    channelId,
  });

  countUserStats({
    userId: author.id,
    type: USER_STATS_RPG_COMMAND_TYPE.adventure,
  });
}

interface IHealReminder {
  client: Client;
  channelId: string;
  author: User;
  content: Message['content'];
}

async function healReminder({client, channelId, author, content}: IHealReminder) {
  const healReminder = await getUserHealReminder({
    userId: author.id,
  });
  if (!healReminder) return;
  const healReminderMsg = await getHealReminderMsg({content, target: healReminder});
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

export function isRpgAdventureSuccess({author, content}: ISuccessChecker) {
  return (
    content.includes(author.username) &&
    ADVENTURE_MONSTER_LIST.some((monster) => content.includes(monster))
  );
}

interface IGetHealReminderMsg {
  content: Message['content'];
  target: number | undefined;
}

export async function getHealReminderMsg({
  content,
  target,
}: IGetHealReminderMsg): Promise<string | void> {
  let hp: string | undefined;
  let hpLost: string | undefined;
  let horseSaved = false;
  let dead = false;
  if (content.includes('but lost fighting')) {
    //player lost
    dead = true;
    if (content.includes('saved you before the enemy')) horseSaved = true;
  } else if (content.includes('found and killed')) {
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
      .split(' ')[1];
  }
  let msg;
  if (horseSaved) {
    msg = `Your horse saved you from dying, ${RPG_CLICKABLE_SLASH_COMMANDS.heal} yourself now`;
  } else if (Number(hpLost) && Number(hpLost) >= Number(hp)) {
    msg = `It's hard to kill the next monster, Time to ${RPG_CLICKABLE_SLASH_COMMANDS.heal} now`;
  } else if (dead) {
    return;
  } else if (hpLost && Number(hpLost) !== 0) {
    // user is damaged
    if (target && Number(hp) <= Number(target))
      msg = `Your HP is getting low. Time to ${RPG_CLICKABLE_SLASH_COMMANDS.heal} now`;
  }
  return msg;
}
