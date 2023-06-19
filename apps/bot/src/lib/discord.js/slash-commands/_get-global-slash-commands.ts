import {ApplicationCommand, Client, DiscordAPIError, Routes} from 'discord.js';
import {djsRestClient} from '../../../services/discord.js/discordjs.service';
import {logger} from '../../../utils/logger';

interface IGetGlobalSlashCommands {
  client: Client;
}

export const _getGlobalSlashCommands = async ({client}: IGetGlobalSlashCommands) => {
  if (!client.user) return [];
  try {
    const data = await djsRestClient.get(Routes.applicationCommands(client.user.id));

    return data as ApplicationCommand[];
  } catch (e: DiscordAPIError | any) {
    logger({
      client,
      message: e.rawError.message,
      variant: 'get-global-slash-commands',
      logLevel: 'error',
    });
    return [];
  }
};
