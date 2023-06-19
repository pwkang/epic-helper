import {ApplicationCommand, Client, DiscordAPIError, Guild, Routes} from 'discord.js';
import {djsRestClient} from '@epic-helper/services';
import {logger} from '@epic-helper/utils';

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
