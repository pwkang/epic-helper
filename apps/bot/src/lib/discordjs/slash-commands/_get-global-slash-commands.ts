import type {ApplicationCommand, Client} from 'discord.js';
import {Routes} from 'discord.js';
import {djsRestClient} from '@epic-helper/services';
import {logger} from '@epic-helper/utils';

export interface IGetGlobalSlashCommands {
  client: Client;
}

export const _getGlobalSlashCommands = async ({
  client
}: IGetGlobalSlashCommands) => {
  if (!client.user) return [];
  try {
    const data = await djsRestClient.get(
      Routes.applicationCommands(client.user.id)
    );

    return data as ApplicationCommand[];
  } catch (e: any) {
    logger({
      message: e.rawError.message,
      variant: 'get-global-slash-commands',
      logLevel: 'error',
      clusterId: client.cluster?.id
    });
    return [];
  }
};
