import {SlashCommandBuilder} from 'discord.js';
import petList from './subcommand/petList';
import petCd from './subcommand/petCd';

export default <SlashCommand>{
  name: 'pet',
  builder: new SlashCommandBuilder()
    .setName('pet')
    .setDescription('Pets command')
    .addSubcommand((subcommand) =>
      subcommand.setName('list').setDescription('List all your registered pets')
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('cd').setDescription('List all your pets on adventure')
    ),
  execute: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case 'list':
        await petList({client, interaction});
        break;
      case 'cd':
        await petCd({client, interaction});
        break;
    }
  },
};
