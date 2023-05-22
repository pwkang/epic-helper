import {Client, Guild, Routes} from 'discord.js';
import {discordJsRest} from '../../../services/discord.js/discordjs.service.ts';

interface IDeleteGuildSlashCommand {
  client: Client;
  guild: Guild;
  commandId: string;
}

export const deleteGuildSlashCommand = async ({
  client,
  guild,
  commandId,
}: IDeleteGuildSlashCommand) => {
  if (!client.user) return [];
  try {
    await discordJsRest.delete(
      Routes.applicationGuildCommand(client.user.id!, guild.id, commandId)
    );
  } catch (e) {
    console.log(e);
  }
};
