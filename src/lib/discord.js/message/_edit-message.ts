import {Client, Message, MessageEditOptions, MessagePayload} from 'discord.js';

interface EditMessageProps {
  client: Client;
  message: Message;
  options: string | MessagePayload | MessageEditOptions;
}

export default async function _editMessage({client, message, options}: EditMessageProps) {
  if (message.author.id !== client.user?.id) return;
  if (message.editable) await message.edit(options);
}
