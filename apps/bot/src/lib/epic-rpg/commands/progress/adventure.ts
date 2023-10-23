import type {Client, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import {
  ADVENTURE_MONSTER_LIST,
  BOT_REMINDER_BASE_COOLDOWN,
  RPG_CLICKABLE_SLASH_COMMANDS,
  RPG_COMMAND_TYPE,
  RPG_COOLDOWN_EMBED_TYPE,
} from '@epic-helper/constants';
import {calcCdReduction} from '../../../epic-helper/reminders/commands-cooldown';
import {updateReminderChannel} from '../../../epic-helper/reminders/reminder-channel';
import {userStatsService} from '../../../../services/database/user-stats.service';
import {USER_STATS_RPG_COMMAND_TYPE} from '@epic-helper/models';
import {userService} from '../../../../services/database/user.service';
import {djsMessageHelper} from '../../../discordjs/message';
import toggleUserChecker from '../../../epic-helper/toggle-checker/user';

interface IRpgAdventure {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgAdventure({
  client,
  message,
  author,
  isSlashCommand,
}: IRpgAdventure) {
  if (!message.inGuild()) return;
  let event = createRpgCommandListener({
    channelId: message.channel.id,
    author,
    client,
    commandType: RPG_COOLDOWN_EMBED_TYPE.adventure,
  });
  if (!event) return;
  event.on('content', async (content) => {
    if (isRpgAdventureSuccess({author, content})) {
      await rpgAdventureSuccess({
        author,
        client,
        channelId: message.channel.id,
        content,
      });
      await healReminder({
        client,
        author,
        content,
        channelId: message.channel.id,
      });
      event?.stop();
    }
  });
  event.on('cooldown', async (cooldown) => {
    await userReminderServices.updateUserCooldown({
      userId: author.id,
      type: RPG_COMMAND_TYPE.adventure,
      readyAt: new Date(Date.now() + cooldown),
    });
  });
  event.on('end', () => {
    event = undefined;
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

const rpgAdventureSuccess = async ({
  author,
  content,
  channelId,
}: IRpgAdventureSuccess) => {
  const toggleChecker = await toggleUserChecker({userId: author.id});
  if (!toggleChecker) return;
  const hardMode = content.includes('(but stronger)');

  if (toggleChecker.reminder.adventure) {
    const cooldown = await calcCdReduction({
      userId: author.id,
      commandType: RPG_COMMAND_TYPE.adventure,
      cooldown: ADVENTURE_COOLDOWN,
    });
    await userReminderServices.saveUserAdventureCooldown({
      userId: author.id,
      hardMode,
      readyAt: new Date(Date.now() + cooldown),
    });
  }

  updateReminderChannel({
    userId: author.id,
    channelId,
  });

  userStatsService.countUserStats({
    userId: author.id,
    type: USER_STATS_RPG_COMMAND_TYPE.adventure,
  });
};

interface IHealReminder {
  client: Client;
  channelId: string;
  author: User;
  content: Message['content'];
}

async function healReminder({
  client,
  channelId,
  author,
  content,
}: IHealReminder) {
  const toggleChecker = await toggleUserChecker({userId: author.id});
  if (!toggleChecker?.heal) return;

  const healReminder = await userService.getUserHealReminder({
    userId: author.id,
  });
  if (!healReminder) return;
  const healReminderMsg = await getHealReminderMsg({
    content,
    target: healReminder,
  });
  if (!healReminderMsg) return;
  await djsMessageHelper.send({
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

const isRpgAdventureSuccess = ({author, content}: ISuccessChecker) => {
  return (
    content.includes(author.username) &&
    ADVENTURE_MONSTER_LIST.some((monster) => content.includes(monster))
  );
};

interface IGetHealReminderMsg {
  content: Message['content'];
  target: number | undefined;
}

const getHealReminderMsg = ({
  content,
  target,
}: IGetHealReminderMsg): string | void => {
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
};
