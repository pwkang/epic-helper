import {SlashCommandBuilder} from 'discord.js';
import {
  RPG_RANDOM_EVENTS_COMMAND,
  RPG_RANDOM_EVENTS_NAME,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {setEnchantChannels} from './subcommand/enchant-channels';
import {setEnchantMuteDuration} from './subcommand/enchant-mute-duration';
import {viewServerSettings} from './subcommand/view-server-settings';
import {setRandomEventMessages} from './subcommand/set-random-event-messages';
import {slashServerTTVerificationSetChannels} from './subcommand/tt-verification/set-channels';
import {slashServerTTVerificationSetRole} from './subcommand/tt-verification/set-role';
import {slashServerTTVerificationRemoveRole} from './subcommand/tt-verification/remove-role';

export default <SlashCommand>{
  name: 'server',
  builder: new SlashCommandBuilder()
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
              {name: 'Add', value: 'add'},
              {name: 'Remove', value: 'remove'},
              {name: 'Reset', value: 'reset'}
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
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('tt-verification')
        .setDescription('Set the TT verification settings')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('set-channel')
            .setDescription('Set the TT verification channel')
            .addChannelOption((option) =>
              option
                .setName('channel')
                .setDescription('Channel to set as TT verification channel')
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('set-role')
            .addRoleOption((option) =>
              option
                .setName('role')
                .setDescription('Role to assign to verified users')
                .setRequired(true)
            )
            .addNumberOption((option) =>
              option
                .setName('from')
                .setDescription('Minimum time travels to assign role')
                .setRequired(true)
            )
            .addNumberOption((option) =>
              option.setName('to').setDescription('Maximum time travels to assign role')
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('remove-role')
            .setDescription('Role to remove')
            .addRoleOption((option) =>
              option
                .setName('role')
                .setDescription('Role to remove from verified users')
                .setRequired(true)
            )
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
    ),
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  execute: async (client, interaction) => {
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    if (subcommandGroup) {
      switch (subcommandGroup) {
        case 'tt-verification':
          switch (subcommand) {
            case 'set-channels':
              await slashServerTTVerificationSetChannels({client, interaction});
              break;
            case 'set-role':
              await slashServerTTVerificationSetRole({client, interaction});
              break;
            case 'remove-role':
              await slashServerTTVerificationRemoveRole({client, interaction});
              break;
          }
          break;
      }
      return;
    }
    switch (subcommand) {
      case 'enchant-channels':
        await setEnchantChannels({client, interaction});
        break;
      case 'enchant-mute-duration':
        await setEnchantMuteDuration({client, interaction});
        break;
      case 'settings':
        await viewServerSettings({client, interaction});
        break;
      case 'random-events':
        await setRandomEventMessages({client, interaction});
        break;
    }
  },
};
