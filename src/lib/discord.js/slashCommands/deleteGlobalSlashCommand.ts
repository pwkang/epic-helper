import {ApplicationCommand, Client, Guild, Routes, SlashCommandBuilder} from 'discord.js';
import {discordJsRest} from '../../../services/discord.js/discordjs.service.ts';

interface IDeleteGuildSlashCommand {
  client: Client;
  commandId: string;
}

export const deleteGlobalSlashCommand = async ({client, commandId}: IDeleteGuildSlashCommand) => {
  if (!client.user) return [];
  await discordJsRest.delete(Routes.applicationCommand(client.user.id!, commandId));
};
