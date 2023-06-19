import {Client, DiscordAPIError, Routes} from 'discord.js';
import {djsRestClient} from '../../../services/discord.js/discordjs.service';
import {logger} from '../../../utils/logger';

interface IDeleteGuildSlashCommand {
  client: Client;
  commandId: string;
}

export const _deleteGlobalSlashCommand = async ({client, commandId}: IDeleteGuildSlashCommand) => {
  if (!client.user) return [];
  try {
    await djsRestClient.delete(Routes.applicationCommand(client.user.id!, commandId));
  } catch (e: DiscordAPIError | any) {
    logger({
      client,
      message: e.rawError.message,
      variant: 'delete-global-slash-command',
      logLevel: 'error',
    });
  }
};
