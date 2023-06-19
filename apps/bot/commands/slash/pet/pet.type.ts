import {ChatInputCommandInteraction, Client} from 'discord.js';

export interface IPetSubcommand {
  client: Client;
  interaction: ChatInputCommandInteraction;
}
