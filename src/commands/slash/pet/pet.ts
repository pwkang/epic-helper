import {SlashCommandBuilder} from 'discord.js';
import petList from './subcommand/petList';

export default <SlashCommand>{
  name: 'pet',
  builder: new SlashCommandBuilder()
    .setName('pet')
    .setDescription('Pets command')
    .addSubcommand((subcommand) =>
      subcommand.setName('list').setDescription('List all your registered pets')
    ),
  execute: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case 'list':
        await petList({client, interaction});
        break;
    }
  },
};
