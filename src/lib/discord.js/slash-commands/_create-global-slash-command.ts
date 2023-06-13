import {ApplicationCommand, Client, Routes, SlashCommandBuilder} from 'discord.js';
import {djsRestClient} from '../../../services/discord.js/discordjs.service.ts';

interface ICreateGlobalSlashCommand {
  client: Client;
  commands: ReturnType<SlashCommandBuilder['toJSON']>;
}

export const _createGlobalSlashCommand = async ({commands, client}: ICreateGlobalSlashCommand) => {
  try {
    const data = await djsRestClient.post(Routes.applicationCommands(client.user?.id!), {
      body: commands,
    });
    return data as ApplicationCommand;
  } catch (e) {
    console.error(e);
  }
};