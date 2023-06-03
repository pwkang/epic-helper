import {SlashCommandBuilder} from 'discord.js';
import {setHealReminder} from './subcommand/user/healReminder';

export default <SlashCommand>{
  name: 'config',
  builder: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configuration for user, guild & server')
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('user')
        .setDescription('User account configuration')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('heal-reminder')
            .setDescription('Set the heal reminder HP target')
            .addNumberOption((input) =>
              input.setName('hp').setDescription('Target HP to heal').setMinValue(1)
            )
            .addBooleanOption((option) =>
              option.setName('remove').setDescription('Remove and disable heal reminder')
            )
        )
    ),
  execute: async (client, interaction) => {
    switch (interaction.options.getSubcommandGroup()) {
      case 'user':
        switch (interaction.options.getSubcommand()) {
          case 'heal-reminder':
            setHealReminder({
              client,
              interaction,
            });
        }
        break;
    }
  },
};
