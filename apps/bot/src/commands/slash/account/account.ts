import {SlashCommandBuilder} from 'discord.js';
import {slashAccountHealReminder} from './subcommand/heal-reminder';
import {slashAccountReminderChannel} from './subcommand/reminder-channel';
import {slashAccountCustomMessages} from './subcommand/custom-messages';
import {USER_ACC_OFF_ACTIONS} from '@epic-helper/constants';
import {slashRegisterAccount} from './subcommand/account-register';
import {slashShowUserAccount} from './subcommand/slash-show-user-account';
import {slashAccountOn} from './subcommand/slash-account-on';
import {slashAccountOff} from './subcommand/slash-account-off';
import {slashAccountDelete} from './subcommand/account-delete';
import {slashAccountDonor} from './subcommand/account-donor';
import {slashAccountDonorPartner} from './subcommand/account-donor-partner';
import {slashAccountEnchantTier} from './subcommand/account-enchant';

export default <SlashCommand>{
  name: 'account',
  builder: new SlashCommandBuilder()
    .setName('account')
    .setDescription('Account related commands')
    .addSubcommand((subcommand) =>
      subcommand.setName('register').setDescription('Register your account')
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('settings').setDescription('View your account settings')
    )
    .addSubcommand((subcommand) => subcommand.setName('on').setDescription('Turn on your account'))
    .addSubcommand((subcommand) =>
      subcommand.setName('off').setDescription('Turn off your account')
    )
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
      subcommand.setName('donor').setDescription('Set EPIC RPG donor tier')
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('donor-partner').setDescription('Set EPIC RPG donor partner tier')
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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('enchant-tier')
        .setDescription('Set the enchant tier for enchant mute helper')
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('delete').setDescription('Delete your account')
    ),
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_ACC_OFF_ACTIONS.skip,
  },
  execute: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case 'register':
        await slashRegisterAccount({client, interaction});
        break;
      case 'settings':
        await slashShowUserAccount({client, interaction});
        break;
      case 'on':
        await slashAccountOn({client, interaction});
        break;
      case 'off':
        await slashAccountOff({client, interaction});
        break;
      case 'heal-reminder':
        await slashAccountHealReminder({client, interaction});
        break;
      case 'reminder-channel':
        await slashAccountReminderChannel({client, interaction});
        break;
      case 'donor':
        await slashAccountDonor({client, interaction});
        break;
      case 'donor-partner':
        await slashAccountDonorPartner({client, interaction});
        break;
      case 'custom-messages':
        await slashAccountCustomMessages({client, interaction});
        break;
      case 'enchant-tier':
        await slashAccountEnchantTier({client, interaction});
        break;
      case 'delete':
        await slashAccountDelete({client, interaction});
        break;
    }
  },
};
