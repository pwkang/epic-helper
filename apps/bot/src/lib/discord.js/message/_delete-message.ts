import {Client, DiscordAPIError, Message} from 'discord.js';
import {logger} from '../../../utils/logger';

interface DeleteMessageProps {
  client: Client;
  message: Message;
}

export default async function _deleteMessage({client, message}: DeleteMessageProps) {
  if (message.author.id !== client.user?.id) return;
  if (!message.deletable) return;
  try {
    await message.delete();
  } catch (e: DiscordAPIError | any) {
    logger({
      client,
      message: e.rawError.message,
      variant: 'delete-message',
      logLevel: 'warn',
    });
  }
}
