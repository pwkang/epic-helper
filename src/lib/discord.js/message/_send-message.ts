import type {
  Channel,
  Client,
  DiscordAPIError,
  Message,
  MessageCreateOptions,
  MessagePayload,
} from 'discord.js';
import {PermissionsBitField, TextChannel} from 'discord.js';
import {logger} from '../../../utils/logger';

const requiredPermissions = [PermissionsBitField.Flags.SendMessages];

interface SendMessageProps {
  client: Client;
  channelId: string;
  options: string | MessagePayload | MessageCreateOptions;
}

export default async function _sendMessage({
  channelId,
  options,
  client,
}: SendMessageProps): Promise<Message | undefined> {
  const channel = client.channels.cache.get(channelId);
  if (!channel) return;

  return checkTypeAndSend({channel, options, client});
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
    // if (!textChannel.permissionsFor(client.user!)?.has(requiredPermissions)) return;
    try {
      sentMessage = await textChannel.send(options);
    } catch (error: DiscordAPIError | any) {
      logger({
        message: error.rawError.message,
        logLevel: 'warn',
        variant: 'sendMessage',
      });
      return;
    }
  }
  return sentMessage;
}
