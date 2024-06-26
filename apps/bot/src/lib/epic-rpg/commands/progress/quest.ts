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
import {userReminderServices} from '@epic-helper/services';
import toggleUserChecker from '../../../epic-helper/toggle-checker/user';
import timestampHelper from '../../../discordjs/timestamp';
import {djsMessageHelper} from '../../../discordjs/message';
import messageFormatter from '../../../discordjs/message-formatter';
import commandHelper from '../../../epic-helper/command-helper';

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
        client,
        questAccepted: true,
        message,
      });
      event?.stop();
    }
    if (isQuestDeclined({message: collected, author})) {
      await rpgQuestSuccess({
        author,
        client,
        questAccepted: false,
        message,
      });
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
        client,
        message,
      });
      event?.stop();
    }
    if (isMinibossQuest({author, embed})) {
      await showMinibossCooldown({
        author,
        client,
        message,
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
  author: User;
  questAccepted?: boolean;
  message: Message<true>;
}

const QUEST_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.quest.accepted;
const DECLINED_QUEST_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.quest.declined;

const rpgQuestSuccess = async ({
  author,
  questAccepted,
  message,
  client,
}: IRpgQuestSuccess) => {
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
      cooldown: questAccepted ? QUEST_COOLDOWN : DECLINED_QUEST_COOLDOWN,
    });
    await userReminderServices.saveUserQuestCooldown({
      epicQuest: false,
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
    type: USER_STATS_RPG_COMMAND_TYPE.quest,
  });
};

interface IShowArenaCooldown {
  client: Client;
  author: User;
  message: Message<true>;
}

export const showArenaCooldown = async ({
  client,
  author,
  message,
}: IShowArenaCooldown) => {
  const toggleChecker = await toggleUserChecker({
    userId: author.id,
    client,
    serverId: message.guild.id,
  });
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
    channelId: message.channel.id,
  });
};

interface IShowMinibossCooldown {
  client: Client;
  author: User;
  message: Message<true>;
}

export const showMinibossCooldown = async ({
  client,
  author,
  message,
}: IShowMinibossCooldown) => {
  const toggleChecker = await toggleUserChecker({
    userId: author.id,
    client,
    serverId: message.guild.id,
  });
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
    channelId: message.guild.id,
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
