import type {ClientOptions, Message} from 'discord.js';
import {IntentsBitField, Options} from 'discord.js';
import ms from 'ms';
import {EPIC_RPG_ID} from '@epic-helper/constants';

const messageFilter = (message: Message) =>
  !isSentByEpicRpg(message) || hasPassedMinutes(message, 10);

const isSentByEpicRpg = (message: Message) => message.author.id === EPIC_RPG_ID;

const hasPassedMinutes = (message: Message, minutes: number) =>
  message.createdAt.getTime() < Date.now() - ms(`${minutes}m`);

export const DiscordClientConfig: ClientOptions = {
  intents: new IntentsBitField().add([
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ]),
  sweepers: {
    messages: {
      interval: 450,
      filter: () => messageFilter
    }
  },
  makeCache: Options.cacheWithLimits({
    BaseGuildEmojiManager: 0,
    GuildBanManager: 0,
    GuildEmojiManager: 0,
    GuildStickerManager: 0,
    GuildInviteManager: 0,
    GuildTextThreadManager: 0,
    ReactionManager: 0,
    ApplicationCommandManager: 0,
    AutoModerationRuleManager: 0,
    GuildForumThreadManager: 0,
    GuildScheduledEventManager: 0,
    PresenceManager: 0,
    ReactionUserManager: 0,
    StageInstanceManager: 0,
    ThreadManager: 0,
    ThreadMemberManager: 0,
    VoiceStateManager: 0,
    MessageManager: 25
  })
};
