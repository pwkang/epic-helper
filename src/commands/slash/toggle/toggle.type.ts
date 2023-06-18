import {ChatInputCommandInteraction, Client} from 'discord.js';

export interface IToggleSubcommand {
  client: Client;
  interaction: ChatInputCommandInteraction;
}
