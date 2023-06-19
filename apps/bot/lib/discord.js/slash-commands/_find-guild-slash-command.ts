import {ApplicationCommand, Client, DiscordAPIError, Guild, Routes} from 'discord.js';
import {djsRestClient} from '../../../services/discord.js/discordjs.service.ts.ts';
import {logger} from '../../../utils/logger';

interface IGetGuildSlashCommands {
  client: Client;
  guild: Guild;
  commandId: string;
}

export const _findGuildSlashCommand = async ({
  guild,
  client,
  commandId,
}: IGetGuildSlashCommands) => {
  if (!client.user) return [];

  try {
    const data = await djsRestClient.get(
      Routes.applicationGuildCommand(client.user.id, guild.id, commandId)
    );

    return data as ApplicationCommand;
  } catch (e: DiscordAPIError | any) {
    logger({
      client,
      message: e.rawError.message,
      variant: 'find-guild-slash-command',
      logLevel: 'error',
    });
    return null;
  }
};
