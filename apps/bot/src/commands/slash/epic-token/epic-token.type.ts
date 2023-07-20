import {ChatInputCommandInteraction, Client} from 'discord.js';

export interface IEpicTokenSubcommand {
  client: Client;
  interaction: ChatInputCommandInteraction;
}
