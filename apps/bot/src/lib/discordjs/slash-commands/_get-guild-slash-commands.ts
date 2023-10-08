import type {ApplicationCommand, Client, Guild} from 'discord.js';
import {Routes} from 'discord.js';
import {djsRestClient} from '@epic-helper/services';
import {logger} from '@epic-helper/utils';

export interface IGetGuildSlashCommands {
  client: Client;
  guild: Guild;
}

export const _getGuildSlashCommands = async ({
  guild,
  client,
}: IGetGuildSlashCommands) => {
  if (!client.user) return [];

  try {
    const data = await djsRestClient.get(
      Routes.applicationGuildCommands(client.user.id, guild.id)
    );

    return data as ApplicationCommand[];
  } catch (e: any) {
    logger({
      message: e.rawError.message,
      variant: 'get-guild-slash-commands',
      logLevel: 'error',
      clusterId: client.cluster?.id,
    });
    return [];
  }
};
