import type {Client} from 'discord.js';
import {Routes} from 'discord.js';
import {logger} from '@epic-helper/utils';
import {djsRestClient} from '@epic-helper/services';

export interface IDeleteGuildSlashCommand {
  client: Client;
  commandId: string;
}

export const _deleteGlobalSlashCommand = async ({
  client,
  commandId,
}: IDeleteGuildSlashCommand) => {
  if (!client.user) return [];
  try {
    await djsRestClient.delete(
      Routes.applicationCommand(client.user.id!, commandId),
    );
  } catch (e: any) {
    logger({
      message: e.rawError.message,
      variant: 'delete-global-slash-command',
      logLevel: 'error',
      clusterId: client.cluster?.id,
    });
  }
};
