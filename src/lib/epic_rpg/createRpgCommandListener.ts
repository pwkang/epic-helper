import {Client, Embed, Message, MessageCollector, TextChannel, User} from 'discord.js';
import {EPIC_RPG_ID} from '../../constants/bot';
import {TypedEventEmitter} from '../../utils/TypedEventEmitter';
import ms from 'ms';

interface RpgCommandListenerProps {
  client: Client;
  channelId: string;
  author: User;
}

type EventTypes = {
  embed: [Embed];
  content: [Message['content']];
  cooldown: [number];
};

type ExtraProps = {
  stop: () => void;
};

const filter = (m: Message) => m.author.id === EPIC_RPG_ID;

export const createRpgCommandListener = ({channelId, client, author}: RpgCommandListenerProps) => {
  const channel = client.channels.cache.get(channelId);
  if (!channel) return;
  let collector: MessageCollector | undefined;
  if (channel instanceof TextChannel) {
    // const textChannel
    collector = channel.createMessageCollector({time: 15000, filter});
  }
  if (!collector) return;
  const event = new TypedEventEmitter<EventTypes>() as TypedEventEmitter<EventTypes> & ExtraProps;

  collector.on('collect', (collected) => {
    if (collected.embeds.length) {
      const embed = collected.embeds[0];
      if (embed.author?.name === `${author.username} — cooldown`) {
        event.emit('cooldown', extractCooldown(embed));
        return;
      }

      event.emit('embed', collected.embeds[0]);
    } else if (!collected.embeds.length) {
      event.emit('content', collected.content);
    }
  });

  event.stop = () => {
    collector?.stop();
    collector?.removeAllListeners();
    event.removeAllListeners();
  };

  return event;
};

function extractCooldown(embed: Embed) {
  let time = embed.title?.split('**')[1].split(' ') ?? [];
  let time_ms = 0;
  time.forEach((t) => {
    time_ms += ms(t);
  });
  return time_ms;
}
