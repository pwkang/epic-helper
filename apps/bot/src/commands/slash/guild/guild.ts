import {SlashCommandBuilder} from 'discord.js';
import {guildSetup} from './subcommand/guild-setup';
import {viewGuildSettings} from './subcommand/guild-settings';
import {guildUpdateReminder} from './subcommand/guild-update-reminder';
import {IGuild} from '@epic-helper/models';
import {deleteGuild} from './subcommand/guild-delete';
import {guildUpdateLeader} from './subcommand/guild-update-leader';
import {showGuildToggle} from './subcommand/toggle/show-guild-toggle';
import {setGuildToggle} from './subcommand/toggle/set-guild-toggle';
import {resetGuildToggle} from './subcommand/toggle/reset-guild-toggle';

export default <SlashCommand>{
  name: 'guild',
  builder: new SlashCommandBuilder()
    .setName('guild')
    .setDescription('Guild command')
    .addSubcommand((subcommand) =>
      subcommand.setName('settings').setDescription('Show guild settings')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('setup')
        .setDescription('Setup a new guild')
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('Only user with this role can trigger guild reminder, duel log, etc.')
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName('leader')
            .setDescription('User that can modify the guild settings without admin permission')
        )
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('set')
        .setDescription('Update guild settings')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('reminder')
            .setDescription('Update guild reminder settings')
            .addRoleOption((option) =>
              option
                .setName('role')
                .setDescription('Select the role of the guild to update')
                .setRequired(true)
            )
            .addChannelOption((option) =>
              option.setName('channel').setDescription('Channel to send reminder message')
            )
            .addNumberOption((option) =>
              option
                .setName('target-stealth')
                .setDescription('Target stealth to switch reminder from upgrade to raid')
            )
            .addStringOption((option) =>
              option
                .setName('upgrade-message')
                .setDescription('Message to send when stealth is below target stealth')
            )
            .addStringOption((option) =>
              option
                .setName('raid-message')
                .setDescription('Message to send when stealth is above target stealth')
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('leader')
            .setDescription(
              'Leader of the guild, can modify guild settings without admin permission'
            )
            .addRoleOption((option) =>
              option
                .setName('role')
                .setDescription('Select the role of the guild to update')
                .setRequired(true)
            )
            .addUserOption((option) =>
              option
                .setName('leader')
                .setDescription('User that can modify the guild settings without admin permission')
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('toggle')
        .setDescription('Toggle guild features')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('show')
            .setDescription('Show guild features')
            .addRoleOption((option) =>
              option
                .setName('role')
                .setDescription('Select the role of the guild to show')
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('set')
            .setDescription('Update guild features')
            .addRoleOption((option) =>
              option
                .setName('role')
                .setDescription('Select the role of the guild to update')
                .setRequired(true)
            )
            .addStringOption((option) => option.setName('on').setDescription('Features to turn on'))
            .addStringOption((option) =>
              option.setName('off').setDescription('Features to turn off')
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('reset')
            .setDescription('Reset guild features')
            .addRoleOption((option) =>
              option
                .setName('role')
                .setDescription('Select the role of the guild to reset')
                .setRequired(true)
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('delete')
        .setDescription('Delete a guild')
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('Select the role of the guild to delete')
            .setRequired(true)
        )
    ),
  execute: async (client, interaction) => {
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();
    if (subcommandGroup) {
      switch (subcommandGroup) {
        case 'set':
          switch (subcommand) {
            case 'reminder':
              guildUpdateReminder({client, interaction});
              break;
            case 'leader':
              guildUpdateLeader({client, interaction});
              break;
          }
          break;
        case 'toggle':
          switch (subcommand) {
            case 'show':
              showGuildToggle({client, interaction});
              break;
            case 'set':
              setGuildToggle({client, interaction});
              break;
            case 'reset':
              resetGuildToggle({client, interaction});
              break;
          }
          break;
      }
    } else {
      switch (subcommand) {
        case 'settings':
          viewGuildSettings({client, interaction});
          break;
        case 'setup':
          guildSetup({client, interaction});
          break;
        case 'delete':
          deleteGuild({client, interaction});
          break;
      }
    }
  },
};
