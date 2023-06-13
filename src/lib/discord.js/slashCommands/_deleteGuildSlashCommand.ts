import {Client, Guild, Routes} from 'discord.js';
import {djsRestClient} from '../../../services/discord.js/discordjs.service.ts';

interface IDeleteGuildSlashCommand {
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
      Routes.applicationGuildCommand(client.user.id!, guild.id, commandId)
    );
  } catch (e) {
    console.error(e);
  }
};
