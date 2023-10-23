import type {Client, Embed, Message, User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {USER_STATS_RPG_COMMAND_TYPE} from '@epic-helper/models';
import {
  BOT_COLOR,
  BOT_REMINDER_BASE_COOLDOWN,
  RPG_COMMAND_TYPE,
  RPG_COOLDOWN_EMBED_TYPE,
} from '@epic-helper/constants';
import {calcCdReduction} from '../../../epic-helper/reminders/commands-cooldown';
import {updateReminderChannel} from '../../../epic-helper/reminders/reminder-channel';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import {userStatsService} from '../../../../services/database/user-stats.service';
import toggleUserChecker from '../../../epic-helper/toggle-checker/user';
import timestampHelper from '../../../discordjs/timestamp';
import {djsMessageHelper} from '../../../discordjs/message';
import messageFormatter from '../../../discordjs/message-formatter';

interface IRpgQuest {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgQuest({client, message, author, isSlashCommand}: IRpgQuest) {
  if (!message.inGuild()) return;
  let event = createRpgCommandListener({
    channelId: message.channel.id,
    client,
    author,
    commandType: RPG_COOLDOWN_EMBED_TYPE.quest,
  });
  if (!event) return;
  event.on('content', async (content, collected) => {
    if (isQuestAccepted({author, content})) {
      await rpgQuestSuccess({
        author,
        channelId: message.channel.id,
        client,
        questAccepted: true,
      });
      event?.stop();
    }
    if (isQuestDeclined({message: collected, author})) {
      await rpgQuestSuccess({
        author,
        channelId: message.channel.id,
        client,
        questAccepted: false,
      });
    }
  });
  event.on('cooldown', async (cooldown) => {
    await userReminderServices.updateUserCooldown({
      userId: author.id,
      type: RPG_COMMAND_TYPE.quest,
      readyAt: new Date(Date.now() + cooldown),
    });
  });
  event.on('embed', async (embed) => {
    if (isCompletingQuest({author, embed})) {
      event?.stop();
    }
    if (isQuestOnGoing({author, embed})) {
      event?.stop();
    }
    if (isArenaQuest({author, embed})) {
      await showArenaCooldown({
        author,
        channelId: message.channel.id,
        client,
      });
      event?.stop();
    }
    if (isMinibossQuest({author, embed})) {
      await showMinibossCooldown({
        author,
        channelId: message.channel.id,
        client,
      });
      event?.stop();
    }
  });
  event.on('end', () => {
    event = undefined;
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

const rpgQuestSuccess = async ({
  author,
  questAccepted,
  channelId,
}: IRpgQuestSuccess) => {
  const toggleChecker = await toggleUserChecker({userId: author.id});
  if (!toggleChecker) return;

  if (toggleChecker.reminder.quest) {
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
  }

  await updateReminderChannel({
    userId: author.id,
    channelId,
  });

  await userStatsService.countUserStats({
    userId: author.id,
    type: USER_STATS_RPG_COMMAND_TYPE.quest,
  });
};

interface IShowArenaCooldown {
  client: Client;
  author: User;
  channelId: string;
}

export const showArenaCooldown = async ({
  client,
  author,
  channelId,
}: IShowArenaCooldown) => {
  const toggleChecker = await toggleUserChecker({userId: author.id});
  if (!toggleChecker) return;
  if (!toggleChecker.questArena) return;
  const cooldown = await userReminderServices.findUserCooldown({
    userId: author.id,
    type: RPG_COMMAND_TYPE.arena,
  });
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed);
  if (cooldown?.readyAt && cooldown.readyAt.getTime() > Date.now()) {
    embed.setDescription(
      `Your **Arena** command is on cooldown! ${timestampHelper.relative({
        time: cooldown.readyAt.getTime(),
      })}`,
    );
  } else {
    embed.setDescription('Your **Arena** command is ready!');
  }
  await djsMessageHelper.send({
    options: {
      content: messageFormatter.user(author.id),
      embeds: [embed],
    },
    client,
    channelId,
  });
};

interface IShowMinibossCooldown {
  client: Client;
  author: User;
  channelId: string;
}

export const showMinibossCooldown = async ({
  client,
  author,
  channelId,
}: IShowMinibossCooldown) => {
  const toggleChecker = await toggleUserChecker({userId: author.id});
  if (!toggleChecker) return;
  if (!toggleChecker.questMiniboss) return;
  const cooldown = await userReminderServices.findUserCooldown({
    userId: author.id,
    type: RPG_COMMAND_TYPE.dungeon,
  });
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed);
  if (cooldown?.readyAt && cooldown.readyAt.getTime() > Date.now()) {
    embed.setDescription(
      `Your **Miniboss** command is on cooldown! ${timestampHelper.relative({
        time: cooldown.readyAt.getTime(),
      })}`,
    );
  } else {
    embed.setDescription('Your **Miniboss** command is ready!');
  }
  await djsMessageHelper.send({
    options: {
      content: messageFormatter.user(author.id),
      embeds: [embed],
    },
    client,
    channelId,
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
  message.mentions.has(author.id) &&
  message.content.includes('you did not accept the quest');

interface IIsQuestOnGoing {
  embed: Embed;
  author: User;
}

const isQuestOnGoing = ({author, embed}: IIsQuestOnGoing) =>
  embed.author?.name === `${author.username} — quest` &&
  embed.description?.includes('quest quit');

interface IIsCompletingQuest {
  embed: Embed;
  author: User;
}

const isCompletingQuest = ({author, embed}: IIsCompletingQuest) =>
  embed.author?.name === `${author.username} — quest` &&
  embed.description?.includes('Complete!');

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
