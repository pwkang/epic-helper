import {SlashCommandBuilder} from 'discord.js';

export default <SlashCommand>{
  name: 'test',
  builder: new SlashCommandBuilder().setName('test').setDescription('Test command'),
  execute: async (client, interaction) => {
    await interaction.reply('Test');
  },
};
