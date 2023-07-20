import {SlashCommandBuilder} from 'discord.js';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {removeEpicToken} from './subcommand/remove-epic-token';
import {useEpicToken} from './subcommand/use-epic-token';

export default <SlashCommand>{
  name: 'epic-token',
  builder: new SlashCommandBuilder()
    .setName('epic-token')
    .setDescription('EPIC Token related commands')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('use')
        .setDescription('Use your epic token on this server')
        .addNumberOption((option) =>
          option
            .setName('token')
            .setDescription('The token to use on this server')
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('remove').setDescription('Remove all your epic token from a server')
    ),
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  execute: async (client, interaction) => {
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case 'use':
        await useEpicToken({client, interaction});
        break;
      case 'remove':
        await removeEpicToken({client, interaction});
        break;
    }
  },
};
