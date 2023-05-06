import type {Client, MessageCreateOptions, MessagePayload, TextBasedChannel} from 'discord.js';
import {DMChannel, PermissionsBitField, TextChannel} from 'discord.js';

const requiredPermissions = [PermissionsBitField.Flags.SendMessages];

interface SendMessageProps {
  client: Client;
  channelId: string;
  options: string | MessagePayload | MessageCreateOptions;
}

export default function sendMessage({channelId, options, client}: SendMessageProps) {
  const channel = client.channels.cache.get(channelId);
  if (!channel) return;

  if (channel instanceof TextChannel) {
    const textChannel = channel as TextChannel;
    if (!textChannel.permissionsFor(client.user!)?.has(requiredPermissions)) return;
    textChannel.send(options).catch(console.error);
  }
}
