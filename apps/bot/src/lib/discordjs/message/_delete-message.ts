import type {Client, Message} from 'discord.js';
import {logger} from '@epic-helper/utils';

export interface DeleteMessageProps {
  client: Client;
  message: Message;
}

export default async function _deleteMessage({
  client,
  message,
}: DeleteMessageProps) {
  if (message.author.id !== client.user?.id) return;
  if (!message.deletable) return;
  try {
    await message.delete();
  } catch (e: any) {
    logger({
      message: e.rawError.message,
      variant: 'delete-message',
      logLevel: 'warn',
      clusterId: client.cluster?.id,
    });
  }
}
