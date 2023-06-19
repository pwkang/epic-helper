import {Client, DiscordAPIError, Routes} from 'discord.js';
import {logger} from '@epic-helper/utils';
import {djsRestClient} from '@epic-helper/services';

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
      message: e.rawError.message,
      variant: 'delete-global-slash-command',
      logLevel: 'error',
    });
  }
};
