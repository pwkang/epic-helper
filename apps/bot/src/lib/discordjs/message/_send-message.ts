import type {
  Channel,
  Client,
  Message,
  MessageCreateOptions,
  MessagePayload,
} from 'discord.js';
import {PermissionsBitField, TextChannel} from 'discord.js';
import {logger} from '@epic-helper/utils';
import {broadcastEval} from '../../../utils/broadcast-eval';

const requiredPermissions = [PermissionsBitField.Flags.SendMessages];

export interface SendMessageProps {
  client: Client;
  channelId: string;
  options: string | MessagePayload | MessageCreateOptions;
  skipIfChannelNotFound?: boolean;
}

export default async function _sendMessage({
  channelId,
  options,
  client,
  skipIfChannelNotFound = false,
}: SendMessageProps): Promise<Message | undefined> {
  const channel = client.channels.cache.get(channelId);
  if (!channel && skipIfChannelNotFound) return;

  if (channel) {
    return checkTypeAndSend({channel, options, client});
  } else {
    await broadcastEval({
      client,
      fn: async (client, context) => {
        await client.utils.djsMessageHelper.send({
          client,
          options: context.messageOptions,
          channelId: context.channelId,
          skipIfChannelNotFound: true,
        });
      },
      context: {
        messageOptions: options,
        channelId,
      },
    });
  }
}

interface CheckTypeAndSendProps {
  channel: Channel;
  options: string | MessagePayload | MessageCreateOptions;
  client: Client;
}

async function checkTypeAndSend({
  channel,
  options,
  client,
}: CheckTypeAndSendProps): Promise<Message | undefined> {
  let sentMessage;
  if (channel instanceof TextChannel) {
    const textChannel = channel as TextChannel;
    if (!textChannel.permissionsFor(client.user!)?.has(requiredPermissions))
      return;
    try {
      sentMessage = await textChannel.send(options);
    } catch (error: any) {
      logger({
        message: error.message,
        logLevel: 'warn',
        variant: 'sendMessage',
        clusterId: client.cluster?.id,
      });
      return;
    }
  }
  return sentMessage;
}
