import {Client, Routes} from 'discord.js';
import {discordJsRest} from '../../../services/discord.js/discordjs.service.ts';

interface IDeleteGuildSlashCommand {
  client: Client;
  commandId: string;
}

export const _deleteGlobalSlashCommand = async ({client, commandId}: IDeleteGuildSlashCommand) => {
  if (!client.user) return [];
  try {
    await discordJsRest.delete(Routes.applicationCommand(client.user.id!, commandId));
  } catch (e) {
    console.error(e);
  }
};
