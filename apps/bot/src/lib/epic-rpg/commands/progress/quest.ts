import {Client, Embed, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {
  USER_STATS_RPG_COMMAND_TYPE,
  userReminderServices,
  userStatsService,
} from '@epic-helper/models';
import {BOT_REMINDER_BASE_COOLDOWN, RPG_COMMAND_TYPE} from '@epic-helper/constants';
import {calcCdReduction} from '../../../epic-helper/reminders/commands-cooldown';
import {updateReminderChannel} from '../../../epic-helper/reminders/reminder-channel';

interface IRpgQuest {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgQuest({client, message, author, isSlashCommand}: IRpgQuest) {
  const event = createRpgCommandListener({
    channelId: message.channel.id,
    client,
    author,
  });
  if (!event) return;
  event.on('content', (content, collected) => {
    if (isQuestAccepted({author, content})) {
      rpgQuestSuccess({
        author,
        channelId: message.channel.id,
        client,
        questAccepted: true,
      });
      event.stop();
    }
    if (isQuestDeclined({message: collected, author})) {
      rpgQuestSuccess({
        author,
        channelId: message.channel.id,
        client,
        questAccepted: false,
      });
    }
  });
  event.on('cooldown', (cooldown) => {
    userReminderServices.updateUserCooldown({
      userId: author.id,
      type: RPG_COMMAND_TYPE.quest,
      readyAt: new Date(Date.now() + cooldown),
    });
  });
  event.on('embed', (embed) => {
    if (isCompletingQuest({author, embed})) {
      event.stop();
    }
    if (isQuestOnGoing({author, embed})) {
      event.stop();
    }
    if (isArenaQuest({author, embed})) {
      event.stop();
    }
    if (isMinibossQuest({author, embed})) {
      event.stop();
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgQuestSuccess {
  client: Client;
  channelId: string;
  author: User;
  questAccepted?: boolean;
}

const QUEST_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.quest.accepted;
const DECLINED_QUEST_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.quest.declined;

const rpgQuestSuccess = async ({author, questAccepted, channelId}: IRpgQuestSuccess) => {
  const cooldown = await calcCdReduction({
    userId: author.id,
    commandType: RPG_COMMAND_TYPE.quest,
    cooldown: questAccepted ? QUEST_COOLDOWN : DECLINED_QUEST_COOLDOWN,
  });
  await userReminderServices.saveUserQuestCooldown({
    epicQuest: false,
    userId: author.id,
    readyAt: new Date(Date.now() + cooldown),
  });
  updateReminderChannel({
    userId: author.id,
    channelId,
  });

  userStatsService.countUserStats({
    userId: author.id,
    type: USER_STATS_RPG_COMMAND_TYPE.quest,
  });
};

interface IIsQuestAccepted {
  content: string;
  author: User;
}

const isQuestAccepted = ({content, author}: IIsQuestAccepted) =>
  content.includes(author.username) && content.includes('new quest');

interface IIsQuestDeclined {
  message: Message;
  author: User;
}

const isQuestDeclined = ({message, author}: IIsQuestDeclined) =>
  message.mentions.has(author.id) && message.content.includes('you did not accept the quest');

interface IIsQuestOnGoing {
  embed: Embed;
  author: User;
}

const isQuestOnGoing = ({author, embed}: IIsQuestOnGoing) =>
  embed.author?.name === `${author.username} — quest` && embed.description?.includes('quest quit');

interface IIsCompletingQuest {
  embed: Embed;
  author: User;
}

const isCompletingQuest = ({author, embed}: IIsCompletingQuest) =>
  embed.author?.name === `${author.username} — quest` && embed.description?.includes('Complete!');

interface IIsArenaQuest {
  embed: Embed;
  author: User;
}

const isArenaQuest = ({author, embed}: IIsArenaQuest) =>
  embed.author?.name === `${author.username} — quest` &&
  embed.fields[0]?.value.includes('join an arena');

interface IIsMinibossQuest {
  embed: Embed;
  author: User;
}

const isMinibossQuest = ({author, embed}: IIsMinibossQuest) =>
  embed.author?.name === `${author.username} — quest` &&
  embed.fields[0]?.value.includes('kill a miniboss');
