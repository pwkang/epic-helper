import {ApplicationCommand, Client, Routes, SlashCommandBuilder} from 'discord.js';
import {discordJsRest} from '../../../services/discord.js/discordjs.service.ts';

interface ICreateGlobalSlashCommand {
  client: Client;
  commands: ReturnType<SlashCommandBuilder['toJSON']>;
}

export const createGlobalSlashCommand = async ({commands, client}: ICreateGlobalSlashCommand) => {
  try {
    const data = await discordJsRest.post(Routes.applicationCommands(client.user?.id!), {
      body: commands,
    });
    return data as ApplicationCommand;
  } catch (e) {
    console.error(e);
  }
};
