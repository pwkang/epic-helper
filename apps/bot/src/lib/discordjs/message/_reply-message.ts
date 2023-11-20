import type {Client, Message, MessageCreateOptions, MessagePayload} from 'discord.js';
import {PermissionsBitField, TextChannel, ThreadChannel} from 'discord.js';
import {logger} from '@epic-helper/utils';

const requiredPermissions = [PermissionsBitField.Flags.SendMessages];

export interface ReplyMessageProps {
  client: Client;
  message: Message;
  options: string | MessagePayload | MessageCreateOptions;
}

export default async function _replyMessage({
  message,
  options,
  client,
}: ReplyMessageProps) {
  const channel = client.channels.cache.get(message.channelId);
  if (!channel) return;

  if (channel instanceof TextChannel) {
    if (!channel.permissionsFor(client.user!)?.has(requiredPermissions))
      return;
    try {
      return await message.reply(options);
    } catch (error: any) {
      logger({
        message: error.rawError.message,
        logLevel: 'warn',
        variant: 'replyMessage',
        clusterId: client.cluster?.id,
      });
      return;
    }
  }
  if (channel instanceof ThreadChannel) {
    if (!channel.permissionsFor(client.user!)?.has(requiredPermissions))
      return;
    try {
      return await message.reply(options);
    } catch (error: any) {
      logger({
        message: error.rawError.message,
        logLevel: 'warn',
        variant: 'replyMessage',
        clusterId: client.cluster?.id,
      });
      return;
    }
  }
}
