import {ApplicationCommand, Client, Routes} from 'discord.js';
import {discordJsRest} from '../../../services/discord.js/discordjs.service.ts';

interface IGetGlobalSlashCommands {
  client: Client;
}

export const getGlobalSlashCommands = async ({client}: IGetGlobalSlashCommands) => {
  if (!client.user) return [];

  const data = await discordJsRest.get(Routes.applicationCommands(client.user.id));

  return data as ApplicationCommand[];
};
