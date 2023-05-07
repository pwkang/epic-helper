import {Client, Message} from 'discord.js';

interface DeleteMessageProps {
  client: Client;
  message: Message;
}

export default function deleteMessage({client, message}: DeleteMessageProps) {
  if (message.author.id !== client.user?.id) return;
  if (message.deletable) message.delete().catch(console.error);
}
