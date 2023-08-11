import {Client, Embed, Message, MessageCollector, TextChannel, User} from 'discord.js';
import {TypedEventEmitter} from './typed-event-emitter';
import ms from 'ms';
import {sleep, typedObjectEntries} from '@epic-helper/utils';
import {EPIC_RPG_ID, RPG_COOLDOWN_EMBED_TYPE} from '@epic-helper/constants';

interface IRpgCommandListener {
  client: Client;
  channelId: string;
  author: User;
  commandType?: ValuesOf<typeof RPG_COOLDOWN_EMBED_TYPE>;
}

type TEventTypes = {
  embed: [Embed, Message];
  content: [Message['content'], Message];
  cooldown: [number];
  attachments: [Message['attachments'], Message];
};

type TExtraProps = {
  stop: () => void;
  pendingAnswer: () => void;
  answered: () => void;
  resetTimer: (ms: number) => void;
  triggerCollect: (message: Message) => void;
};

const filter = (m: Message) => m.author.id === EPIC_RPG_ID;

export const createRpgCommandListener = ({
  channelId,
  client,
  author,
  commandType,
}: IRpgCommandListener) => {
  const channel = client.channels.cache.get(channelId);
  if (!channel) return;
  let collector: MessageCollector | undefined;
  if (channel instanceof TextChannel) {
    // const textChannel
    collector = channel.createMessageCollector({time: 15000, filter});
  }
  if (!collector) return;
  const event = new TypedEventEmitter<TEventTypes>() as TypedEventEmitter<TEventTypes> &
    TExtraProps;
  let police = false;
  let waitingAnswer = false;

  event.stop = () => {
    collector?.stop();
    collector?.removeAllListeners();
    event.removeAllListeners();
  };

  event.pendingAnswer = () => {
    waitingAnswer = true;
  };
  event.answered = () => {
    waitingAnswer = false;
  };

  event.resetTimer = (ms: number) => {
    collector?.resetTimer({time: ms});
  };

  event.triggerCollect = (message: Message) => {
    messageCollected(message);
  };

  collector.on('collect', messageCollected);

  async function messageCollected(collected: Message) {
    if (
      isSlashCommand({collected, author}) &&
      collected.content === '' &&
      collected.embeds.length === 0
    ) {
      await sleep(1000);
      collected = collector?.channel.messages.cache.get(collected.id) as Message;
    }

    if (collected.embeds.length) {
      const embed = collected.embeds[0];

      // the command is on cooldown
      if (embed.author?.name === `${author.username} — cooldown`) {
        const embedType = getCooldownType(embed);
        if (commandType === embedType) event.emit('cooldown', extractCooldown(embed));
        event.stop();
        return;
      }

      if (isUserSpamming({collected, author})) {
        event.stop();
        return;
      }

      if (police) return;
      event.emit('embed', collected.embeds[0], collected);
    } else if (!collected.embeds.length) {
      // Message Content
      if (isBotMaintenance({collected, author})) {
        event.stop();
        return;
      }

      if (isStoppedByPolice({collected, author})) {
        police = true;
        return;
      }

      if (isArrested({author, collected})) {
        event.stop();
        return;
      }

      if (isInJail({author, collected})) {
        event.stop();
        return;
      }

      if (isPolicePass({author, collected})) {
        police = false;
        return;
      }

      if (isUserInCommand({author, collected})) {
        if (waitingAnswer || police) {
          return;
        } else {
          event.stop();
          return;
        }
      }

      if (police) return;
      event.emit('content', collected.content, collected);
    }

    if (collected.attachments.size) {
      event.emit('attachments', collected.attachments, collected);
    }
  }

  return event;
};

function extractCooldown(embed: Embed) {
  const time = embed.title?.split('**')[1].split(' ') ?? [];
  let time_ms = 0;
  time.forEach((t) => {
    time_ms += ms(t);
  });
  return time_ms;
}

const commandKeyword: Record<ValuesOf<typeof RPG_COOLDOWN_EMBED_TYPE>, string> = {
  daily: 'You have claimed your daily rewards already',
  weekly: 'You have claimed your weekly rewards already',
  lootbox: 'You have already bought a lootbox',
  hunt: 'You have already looked around',
  adventure: 'You have already been in an adventure',
  training: 'You have trained already',
  duel: 'You have been in a duel recently',
  quest: 'You have already claimed a quest',
  working: 'You have already got some resources',
  farm: 'You have already farmed',
  horse: 'You have used this command recently',
  arena: 'You have started an arena recently',
  dungeon: 'You have been in a fight with a boss recently',
  epicItem: 'You have used an EPIC item already',
  guild: 'Your guild has already raided or been upgraded',
  halboo: 'You have scared someone recently',
};

function getCooldownType(embed: Embed) {
  for (const [key, value] of typedObjectEntries(commandKeyword)) {
    if (embed.title?.includes(value)) {
      return key;
    }
  }
  return null;
}

interface IChecker {
  collected: Message;
  author: User;
}

function isBotMaintenance({author, collected}: IChecker) {
  return (
    collected.content.includes('The bot is under maintenance!') && collected.mentions.has(author.id)
  );
}

function isStoppedByPolice({author, collected}: IChecker) {
  return (
    collected.mentions.has(author.id) && collected.content.includes('We have to check you are')
  );
}

function isArrested({author, collected}: IChecker) {
  return (
    collected.content.includes(author.username) && collected.content.includes('Get in the car')
  );
}

function isInJail({author, collected}: IChecker) {
  return collected.mentions.has(author.id) && collected.content.includes('you are in the **jail**');
}

function isUserInCommand({author, collected}: IChecker) {
  return (
    collected.content.includes('end your previous command') && collected.mentions.has(author.id)
  );
}

function isUserSpamming({author, collected}: IChecker) {
  const embed = collected.embeds[0];
  if (!embed) return false;
  return (
    embed.author?.name === author.username && embed.fields[0]?.name.includes('please don\'t spam')
  );
}

function isPolicePass({author, collected}: IChecker) {
  return (
    collected.content.includes('Everything seems fine') &&
    collected.content.includes(author.username)
  );
}

function isSlashCommand({collected}: IChecker) {
  return collected.content === '' && collected.embeds.length === 0 && collected.interaction?.id;
}
