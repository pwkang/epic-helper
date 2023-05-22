import {ApplicationCommand, Client, Guild, REST, Routes} from 'discord.js';
import {discordJsRest} from '../../../services/discord.js/discordjs.service.ts';

interface IGetGuildSlashCommands {
  client: Client;
  guild: Guild;
}

export const getGuildSlashCommands = async ({guild, client}: IGetGuildSlashCommands) => {
  if (!client.user) return [];

  const data = await discordJsRest.get(Routes.applicationGuildCommands(client.user.id, guild.id));

  return data as ApplicationCommand[];
};
