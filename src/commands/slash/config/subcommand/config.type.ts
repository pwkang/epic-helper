import {ChatInputCommandInteraction, Client} from 'discord.js';

export interface IUserConfig {
  client: Client;
  interaction: ChatInputCommandInteraction;
}

export interface IServerConfig {
  client: Client;
  interaction: ChatInputCommandInteraction;
}
