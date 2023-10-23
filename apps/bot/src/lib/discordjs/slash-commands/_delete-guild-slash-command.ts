import type {Client, Guild} from 'discord.js';
import {Routes} from 'discord.js';
import {logger} from '@epic-helper/utils';
import {djsRestClient} from '@epic-helper/services';

export interface IDeleteGuildSlashCommand {
  client: Client;
  guild: Guild;
  commandId: string;
}

export const _deleteGuildSlashCommand = async ({
  client,
  guild,
  commandId,
}: IDeleteGuildSlashCommand) => {
  if (!client.user) return [];
  try {
    await djsRestClient.delete(
      Routes.applicationGuildCommand(client.user.id!, guild.id, commandId),
    );
  } catch (e: any) {
    logger({
      message: e.rawError.message,
      variant: 'delete-guild-slash-command',
      logLevel: 'error',
      clusterId: client.cluster?.id,
    });
  }
};
