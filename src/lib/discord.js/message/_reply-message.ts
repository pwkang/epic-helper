import type {
  Client,
  DiscordAPIError,
  Message,
  MessageCreateOptions,
  MessagePayload,
} from 'discord.js';
import {PermissionsBitField, TextChannel} from 'discord.js';
import {logger} from '../../../utils/logger';

const requiredPermissions = [PermissionsBitField.Flags.SendMessages];

interface ReplyMessageProps {
  client: Client;
  message: Message;
  options: string | MessagePayload | MessageCreateOptions;
}

export default async function _replyMessage({message, options, client}: ReplyMessageProps) {
  const channel = client.channels.cache.get(message.channelId);
  if (!channel) return;

  if (channel instanceof TextChannel) {
    const textChannel = channel as TextChannel;
    if (!textChannel.permissionsFor(client.user!)?.has(requiredPermissions)) return;
    try {
      return await message.reply(options);
    } catch (error: DiscordAPIError | any) {
      logger({
        message: error.rawError.message,
        logLevel: 'warn',
        variant: 'replyMessage',
      });
      return;
    }
  }
}
