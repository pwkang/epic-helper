import type {
  BaseInteraction,
  Client,
  InteractionUpdateOptions,
  MessageCreateOptions,
  MessagePayload,
  StringSelectMenuInteraction
} from 'discord.js';
import {Collection} from 'discord.js';
import ms from 'ms';
import {djsMessageHelper} from './index';
import djsInteractionHelper from '../interaction';
import disableAllComponents from '../../../utils/disable-components';

export interface SendInteractiveMessageProps {
  client: Client;
  channelId: string;
  options: string | MessagePayload | MessageCreateOptions;
  onStop?: () => void;
}

type TEventCB = (
  collected: BaseInteraction | StringSelectMenuInteraction,
  customId: string
) => Promise<InteractionUpdateOptions | null> | InteractionUpdateOptions | null;

export default async function _sendInteractiveMessage<
  EventType extends string
>({channelId, options, client, onStop}: SendInteractiveMessageProps) {
  const channel = client.channels.cache.get(channelId);
  if (!channel) return;

  const sentMessage = await djsMessageHelper.send({
    channelId,
    client,
    options
  });
  if (!sentMessage) return;

  let allEventsFn: TEventCB | null = null;
  const registeredEvents = new Collection<string | EventType, TEventCB>();
  let collector = sentMessage.createMessageComponentCollector({
    idle: ms('1m')
  });

  function every(callback: TEventCB) {
    allEventsFn = callback;
  }

  function on(
    customId: EventType extends undefined ? string : EventType,
    callback: TEventCB
  ) {
    registeredEvents.set(customId, callback);
  }

  collector.on('collect', async (collected) => {
    if (collected.message.id !== sentMessage.id) return;
    const callback = registeredEvents.get(collected.customId as string);
    let replyOptions: InteractionUpdateOptions | null = null;

    if (allEventsFn) {
      replyOptions = await allEventsFn(collected, collected.customId);
    } else if (callback) {
      replyOptions = await callback(collected, collected.customId);
    }
    if (!replyOptions) return;
    await djsInteractionHelper.updateInteraction({
      interaction: collected,
      options: replyOptions,
      client
    });
  });

  function stop() {
    collector.stop();
    collector.removeAllListeners();
    collector = undefined as any;
    onStop?.();
  }

  function isEnded() {
    return collector.ended;
  }

  collector.on('end', (collected, reason) => {
    if (!sentMessage) return;

    if (reason === 'idle')
      djsMessageHelper.edit({
        client,
        message: sentMessage,
        options: {
          components: disableAllComponents(sentMessage.components)
        }
      });
  });

  return {
    on,
    stop,
    isEnded,
    every,
    message: sentMessage
  };
}
