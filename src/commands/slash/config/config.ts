import {SlashCommandBuilder} from 'discord.js';
import {setHealReminder} from './subcommand/user/healReminder';
import {RPG_COMMAND_TYPE} from '../../../constants/epic_rpg/rpg';
import {setReminderChannelSlash} from './subcommand/user/reminderChannel.slash';

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
        .addSubcommand((subcommand) =>
          subcommand
            .setName('reminder-channel')
            .setDescription('Customize the the channel for different reminders')
            .addStringOption((option) =>
              option
                .setName('reminder-type')
                .setDescription(
                  'Type of reminder, separate different type with space. e.g. hunt adv use'
                )
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName('action')
                .setDescription('Action to perform')
                .setRequired(true)
                .setChoices(
                  {
                    name: 'Set',
                    value: 'set',
                  },
                  {
                    name: 'Remove',
                    value: 'remove',
                  }
                )
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
          case 'reminder-channel':
            setReminderChannelSlash({
              client,
              interaction,
            });
            break;
        }
        break;
    }
  },
};
