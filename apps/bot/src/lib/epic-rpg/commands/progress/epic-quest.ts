import type {Client, Embed, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {USER_STATS_RPG_COMMAND_TYPE} from '@epic-helper/models';
import {BOT_REMINDER_BASE_COOLDOWN, RPG_COMMAND_TYPE, RPG_COOLDOWN_EMBED_TYPE} from '@epic-helper/constants';
import {calcCdReduction} from '../../../epic-helper/reminders/commands-cooldown';
import {updateReminderChannel} from '../../../epic-helper/reminders/reminder-channel';
import toggleUserChecker from '../../../epic-helper/toggle-checker/user';
import commandHelper from '../../../epic-helper/command-helper';
import {userReminderServices} from '@epic-helper/services';

interface IRpgEpicQuest {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgEpicQuest({
  client,
  message,
  author,
  isSlashCommand,
}: IRpgEpicQuest) {
  if (!message.inGuild()) return;
  let event = createRpgCommandListener({
    author,
    client,
    channelId: message.channel.id,
    commandType: RPG_COOLDOWN_EMBED_TYPE.quest,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isEpicQuestSuccess({embed, author})) {
      await rpgEpicQuestSuccess({
        author,
        client,
        message,
      });
      event?.stop();
    }
  });
  event.on('content', async (content) => {
    if (isEpicHorseMissing({content})) {
      event?.stop();
    }
    if (isHavingQuest({content})) {
      event?.stop();
    }
  });
  event.on('cooldown', async (cooldown) => {
    const toggleUser = await toggleUserChecker({
      userId: author.id,
      serverId: message.guild.id,
      client,
    });
    if (!toggleUser?.reminder.quest) return;
    await userReminderServices.updateUserCooldown({
      userId: author.id,
      readyAt: new Date(Date.now() + cooldown),
      type: RPG_COMMAND_TYPE.quest,
    });
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgEpicQuestSuccess {
  client: Client;
  author: User;
  message: Message<true>;
}

const QUEST_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.epicQuest;

const rpgEpicQuestSuccess = async ({
  author,
  message,
  client,
}: IRpgEpicQuestSuccess) => {
  const toggleChecker = await toggleUserChecker({
    userId: author.id,
    client,
    serverId: message.guild.id,
  });
  if (!toggleChecker) return;

  if (toggleChecker.reminder.quest) {
    const cooldown = await calcCdReduction({
      userId: author.id,
      commandType: RPG_COMMAND_TYPE.quest,
      cooldown: QUEST_COOLDOWN,
    });
    await userReminderServices.saveUserQuestCooldown({
      epicQuest: true,
      userId: author.id,
      readyAt: new Date(Date.now() + cooldown),
    });
  }

  await updateReminderChannel({
    client,
    userId: author.id,
    channelId: message.channel.id,
  });

  commandHelper.userStats.countCommand({
    userId: author.id,
    type: USER_STATS_RPG_COMMAND_TYPE.epicQuest,
  });
};

interface IIsEpicQuestSuccess {
  embed: Embed;
  author: User;
}

const isEpicQuestSuccess = ({embed, author}: IIsEpicQuestSuccess) =>
  embed.author?.name === `${author.username} — epic quest` &&
  ['You failed the quest', 'Your profit was'].some((str) =>
    embed.fields[0]?.value.includes(str),
  );

interface IIsEpicHorseMissing {
  content: string;
}

const isEpicHorseMissing = ({content}: IIsEpicHorseMissing) =>
  content.includes('special horse');

interface IIsHavingQuest {
  content: string;
}

const isHavingQuest = ({content}: IIsHavingQuest) =>
  content.includes('You cannot do this if you have a pending quest!');
