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

interface IRpgEpicQuest {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgEpicQuest({client, message, author, isSlashCommand}: IRpgEpicQuest) {
  const event = createRpgCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isEpicQuestSuccess({embed, author})) {
      await rpgEpicQuestSuccess({
        author,
        channelId: message.channel.id,
        client,
      });
    }
  });
  event.on('content', async (content) => {
    if (isEpicHorseMissing({content})) {
      event.stop();
    }
    if (isHavingQuest({content})) {
      event.stop();
    }
  });
  event.on('cooldown', async (cooldown) => {
    await userReminderServices.updateUserCooldown({
      userId: author.id,
      readyAt: new Date(Date.now() + cooldown),
      type: RPG_COMMAND_TYPE.quest,
    });
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgEpicQuestSuccess {
  client: Client;
  channelId: string;
  author: User;
}

const QUEST_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.epicQuest;

const rpgEpicQuestSuccess = async ({author, channelId}: IRpgEpicQuestSuccess) => {
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
  updateReminderChannel({
    userId: author.id,
    channelId,
  });

  userStatsService.countUserStats({
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
  ['You failed the quest', 'Your profit was'].some((str) => embed.fields[0]?.value.includes(str));

interface IIsEpicHorseMissing {
  content: string;
}

const isEpicHorseMissing = ({content}: IIsEpicHorseMissing) => content.includes('special horse');

interface IIsHavingQuest {
  content: string;
}

const isHavingQuest = ({content}: IIsHavingQuest) =>
  content.includes('You cannot do this if you have a pending quest!');
