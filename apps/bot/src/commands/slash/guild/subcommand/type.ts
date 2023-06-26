import {ChatInputCommandInteraction, Client} from 'discord.js';

export interface IGuildSubCommand {
  client: Client;
  interaction: ChatInputCommandInteraction;
}
