import {SlashCommandBuilder} from 'discord.js';
import {setHealReminder} from './subcommand/user/heal-reminder';
import {setReminderChannelSlash} from './subcommand/user/reminder-channel';
import {setEnchantChannels} from './subcommand/server/enchant-channels';
import {setEnchantMuteDuration} from './subcommand/server/enchant-mute-duration';

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
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('server')
        .setDescription('Server configuration')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('enchant-channels')
            .setDescription('Set the enchant channels')
            .addStringOption((option) =>
              option
                .setName('action')
                .setDescription('Action to perform')
                .setRequired(true)
                .setChoices(
                  {
                    name: 'Add',
                    value: 'add',
                  },
                  {
                    name: 'Remove',
                    value: 'remove',
                  },
                  {
                    name: 'Reset',
                    value: 'reset',
                  }
                )
            )
            .addStringOption((option) =>
              option
                .setName('channels')
                .setDescription('Mention multiple channels to perform action')
                .setRequired(false)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('enchant-mute-duration')
            .setDescription('Set the enchant mute duration')
            .addNumberOption((option) =>
              option
                .setName('duration')
                .setDescription('Mute duration in seconds')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(60)
            )
        )
    ),
  execute: async (client, interaction) => {
    switch (interaction.options.getSubcommandGroup()) {
      case 'user':
        switch (interaction.options.getSubcommand()) {
          case 'heal-reminder':
            setHealReminder({client, interaction});
            break;
          case 'reminder-channel':
            setReminderChannelSlash({client, interaction});
            break;
        }
        break;
      case 'server':
        switch (interaction.options.getSubcommand()) {
          case 'enchant-channels':
            setEnchantChannels({client, interaction});
            break;
          case 'enchant-mute-duration':
            setEnchantMuteDuration({client, interaction});
            break;
        }
    }
  },
};
