import {ApplicationCommand, Client, DiscordAPIError, Guild, Routes} from 'discord.js';
import {djsRestClient} from '../../../services/discord.js/discordjs.service.ts.ts';
import {logger} from '../../../utils/logger';

interface IGetGuildSlashCommands {
  client: Client;
  guild: Guild;
}

export const _getGuildSlashCommands = async ({guild, client}: IGetGuildSlashCommands) => {
  if (!client.user) return [];

  try {
    const data = await djsRestClient.get(Routes.applicationGuildCommands(client.user.id, guild.id));

    return data as ApplicationCommand[];
  } catch (e: DiscordAPIError | any) {
    logger({
      client,
      message: e.rawError.message,
      variant: 'get-guild-slash-commands',
      logLevel: 'error',
    });
    return [];
  }
};
