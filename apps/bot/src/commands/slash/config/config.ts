import {SlashCommandBuilder} from 'discord.js';
import {setHealReminder} from './subcommand/heal-reminder';
import {setReminderChannelSlash} from './subcommand/reminder-channel';
import {setCustomMessages} from './subcommand/custom-messages';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashCommand>{
  name: 'config',
  builder: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configuration for user, guild & server')
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
          option.setName('action').setDescription('Action to perform').setRequired(true).setChoices(
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
    .addSubcommand((subcommand) =>
      subcommand
        .setName('custom-messages')
        .setDescription('Customize the reminder messages for different reminders')
    ),
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  execute: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case 'heal-reminder':
        setHealReminder({client, interaction});
        break;
      case 'reminder-channel':
        setReminderChannelSlash({client, interaction});
        break;
      case 'custom-messages':
        setCustomMessages({client, interaction});
        break;
    }
  },
};
