import {ApplicationCommand, Client, Guild, Routes} from 'discord.js';
import {djsRestClient} from '../../../services/discord.js/discordjs.service.ts';

interface IGetGuildSlashCommands {
  client: Client;
  guild: Guild;
  commandId: string;
}

export const _findGuildSlashCommand = async ({
  guild,
  client,
  commandId,
}: IGetGuildSlashCommands) => {
  if (!client.user) return [];

  try {
    const data = await djsRestClient.get(
      Routes.applicationGuildCommand(client.user.id, guild.id, commandId)
    );

    return data as ApplicationCommand;
  } catch (e) {
    console.error(e);
  }
};
