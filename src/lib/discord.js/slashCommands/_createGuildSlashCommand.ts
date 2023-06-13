import {ApplicationCommand, Client, Guild, Routes, SlashCommandBuilder} from 'discord.js';
import {discordJsRest} from '../../../services/discord.js/discordjs.service.ts';

interface ICreateGuildSlashCommand {
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
    const data = await discordJsRest.post(
      Routes.applicationGuildCommands(client.user.id!, guild.id),
      {
        body: commands,
      }
    );
    return data as ApplicationCommand;
  } catch (e) {
    console.error(e);
  }
};
