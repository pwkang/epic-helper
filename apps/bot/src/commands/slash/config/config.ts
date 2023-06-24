import {SlashCommandBuilder} from 'discord.js';
import {setHealReminder} from './subcommand/user/heal-reminder';
import {setReminderChannelSlash} from './subcommand/user/reminder-channel';
import {setEnchantChannels} from './subcommand/server/enchant-channels';
import {setEnchantMuteDuration} from './subcommand/server/enchant-mute-duration';
import {setCustomMessages} from './subcommand/user/custom-messages';
import {viewServerSettings} from './subcommand/server/view-server-settings';
import {
  RPG_RANDOM_EVENTS,
  RPG_RANDOM_EVENTS_COMMAND,
  RPG_RANDOM_EVENTS_NAME,
} from '@epic-helper/constants';
import {setRandomEventMessages} from './subcommand/server/set-random-event-messages';

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
        .addSubcommand((subcommand) =>
          subcommand
            .setName('custom-messages')
            .setDescription('Customize the reminder messages for different reminders')
        )
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('server')
        .setDescription('Server configuration')
        .addSubcommand((subcommand) =>
          subcommand.setName('settings').setDescription('View the server settings')
        )
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
        .addSubcommand((subcommand) =>
          subcommand
            .setName('random-events')
            .setDescription('set message to send when random events occur (type "clear" to remove)')
            .addStringOption((option) =>
              option
                .setName(RPG_RANDOM_EVENTS_COMMAND.log.replaceAll(' ', '-').toLowerCase())
                .setDescription(RPG_RANDOM_EVENTS_NAME.log)
            )
            .addStringOption((option) =>
              option
                .setName(RPG_RANDOM_EVENTS_COMMAND.fish.replaceAll(' ', '-').toLowerCase())
                .setDescription(RPG_RANDOM_EVENTS_NAME.fish)
            )
            .addStringOption((option) =>
              option
                .setName(RPG_RANDOM_EVENTS_COMMAND.coin.replaceAll(' ', '-').toLowerCase())
                .setDescription(RPG_RANDOM_EVENTS_NAME.coin)
            )
            .addStringOption((option) =>
              option
                .setName(RPG_RANDOM_EVENTS_COMMAND.lootbox.replaceAll(' ', '-').toLowerCase())
                .setDescription(RPG_RANDOM_EVENTS_NAME.lootbox)
            )
            .addStringOption((option) =>
              option
                .setName(RPG_RANDOM_EVENTS_COMMAND.boss.replaceAll(' ', '-').toLowerCase())
                .setDescription(RPG_RANDOM_EVENTS_NAME.boss)
            )
            .addStringOption((option) =>
              option
                .setName(RPG_RANDOM_EVENTS_COMMAND.arena.replaceAll(' ', '-').toLowerCase())
                .setDescription(RPG_RANDOM_EVENTS_NAME.arena)
            )
            .addStringOption((option) =>
              option
                .setName(RPG_RANDOM_EVENTS_COMMAND.miniboss.replaceAll(' ', '-').toLowerCase())
                .setDescription(RPG_RANDOM_EVENTS_NAME.miniboss)
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
          case 'custom-messages':
            setCustomMessages({client, interaction});
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
          case 'settings':
            viewServerSettings({client, interaction});
            break;
          case 'random-events':
            setRandomEventMessages({client, interaction});
            break;
        }
    }
  },
};
