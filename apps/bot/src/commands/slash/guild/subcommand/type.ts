import {ChatInputCommandInteraction, Client} from 'discord.js';
import {IGuild} from '@epic-helper/models';

export interface IGuildSubCommand {
  client: Client;
  interaction: ChatInputCommandInteraction;
}
