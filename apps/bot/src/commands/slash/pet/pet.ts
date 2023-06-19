import {SlashCommandBuilder} from 'discord.js';
import petList from './subcommand/pet-list';
import petCd from './subcommand/pet-cd';
import petCalcFusionScore from './subcommand/pet-calc-fusion-score';

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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('calc-fusion-score')
        .setDescription('Calculate fusion score')
        .addStringOption((option) =>
          option
            .setName('pet-id')
            .setDescription('ID of the pet, separate multiple pets with space')
            .setRequired(true)
        )
    ),
  execute: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case 'list':
        await petList({client, interaction});
        break;
      case 'cd':
        await petCd({client, interaction});
        break;
      case 'calc-fusion-score':
        await petCalcFusionScore({client, interaction});
        break;
    }
  },
};