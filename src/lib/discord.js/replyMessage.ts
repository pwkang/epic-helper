import type {
  Client,
  Message,
  MessageCreateOptions,
  MessagePayload,
  TextBasedChannel,
} from 'discord.js';
import {DMChannel, PermissionsBitField, TextChannel} from 'discord.js';

const requiredPermissions = [PermissionsBitField.Flags.SendMessages];

interface ReplyMessageProps {
  client: Client;
  message: Message;
  options: string | MessagePayload | MessageCreateOptions;
}

export default function replyMessage({message, options, client}: ReplyMessageProps) {
  const channel = client.channels.cache.get(message.channelId);
  if (!channel) return;

  if (channel instanceof TextChannel) {
    const textChannel = channel as TextChannel;
    if (!textChannel.permissionsFor(client.user!)?.has(requiredPermissions)) return;
    message.reply(options).catch(console.error);
  }
}
