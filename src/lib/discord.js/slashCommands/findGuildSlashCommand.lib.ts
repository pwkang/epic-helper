import {ApplicationCommand, Client, Guild, REST, Routes} from 'discord.js';
import {discordJsRest} from '../../../services/discord.js/discordjs.service.ts';

interface IGetGuildSlashCommands {
  client: Client;
  guild: Guild;
  commandId: string;
}

export const findGuildSlashCommand = async ({guild, client, commandId}: IGetGuildSlashCommands) => {
  if (!client.user) return [];

  const data = await discordJsRest.get(
    Routes.applicationGuildCommand(client.user.id, guild.id, commandId)
  );

  return data as ApplicationCommand;
};
