import {ApplicationCommand, Client, Guild, Routes, SlashCommandBuilder} from 'discord.js';
import {logger} from '@epic-helper/utils';
import {djsRestClient} from '@epic-helper/services';

export interface ICreateGuildSlashCommand {
  client: Client;
  commands: ReturnType<SlashCommandBuilder['toJSON']>;
  guild: Guild;
}

export const _createGuildSlashCommand = async ({
  commands,
  client,
  guild,
}: ICreateGuildSlashCommand) => {
  if (!client.user) return [];
  try {
    const data = await djsRestClient.post(
      Routes.applicationGuildCommands(client.user.id!, guild.id),
      {
        body: commands,
      }
    );
    return data as ApplicationCommand;
  } catch (e: any) {
    logger({
      message: e.rawError,
      variant: 'create-guild-slash-command',
      logLevel: 'error',
      clusterId: client.cluster?.id,
    });
    return null;
  }
};
