import {SlashCommandBuilder} from 'discord.js';

export default <SlashCommand>{
  name: 'bot-help',
  builder: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all commands or information of the bot'),
  execute: async (client, interaction) => {},
};
