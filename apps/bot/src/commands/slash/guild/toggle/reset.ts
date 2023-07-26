import {guildService} from '../../../../services/database/guild.service';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND_GUILD_NAME, SLASH_COMMAND_GUILD_TOGGLE_NAME} from '../constant';

export default <SlashCommand>{
  name: 'reset',
  description: 'Reset the toggle for a guild',
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  commandName: SLASH_COMMAND_GUILD_NAME,
  groupName: SLASH_COMMAND_GUILD_TOGGLE_NAME,
  builder: (subcommand) =>
    subcommand.addRoleOption((option) =>
      option
        .setName('role')
        .setDescription('Select the role of the guild to reset')
        .setRequired(true)
    ),
  execute: async (client, interaction) => {
    if (!interaction.inGuild()) return;
    const guildRole = interaction.options.getRole('role', true);

    const guildAccount = await guildService.findGuild({
      serverId: interaction.guildId,
      roleId: guildRole.id,
    });

    if (!guildAccount)
      return djsInteractionHelper.replyInteraction({
        client,
        interaction,
        options: {
          content: `There is no guild with role ${guildRole} setup in this server`,
          ephemeral: true,
        },
      });

    const updatedGuildAccount = await guildService.resetToggle({
      serverId: interaction.guildId,
      roleId: guildRole.id,
    });
    if (!updatedGuildAccount) return;
    const embed = commandHelper.toggle.getGuildToggleEmbed({
      guildAccount: updatedGuildAccount,
    });
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: {
        embeds: [embed],
      },
    });
  },
};
