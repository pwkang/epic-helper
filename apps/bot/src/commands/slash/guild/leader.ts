import {guildService} from '../../../services/database/guild.service';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import commandHelper from '../../../lib/epic-helper/command-helper';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND_GUILD_NAME} from './constant';

export default <SlashCommand>{
  name: 'leader',
  description: 'Leader of the guild, can modify guild settings without admin permission',
  type: 'subcommand',
  commandName: SLASH_COMMAND_GUILD_NAME,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  builder: (subcommand) =>
    subcommand
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
      ),
  execute: async (client, interaction) => {
    const role = interaction.options.getRole('role', true);
    const leader = interaction.options.getUser('leader', true);

    const isRoleUsed = await guildService.isRoleUsed({
      serverId: interaction.guildId!,
      roleId: role.id,
    });
    if (!isRoleUsed) {
      return djsInteractionHelper.replyInteraction({
        client,
        interaction,
        options: {
          content: `There is no guild with role ${role} setup in this server`,
          ephemeral: true,
        },
      });
    }

    const updatedGuild = await guildService.updateLeader({
      serverId: interaction.guildId!,
      roleId: role.id,
      leaderId: leader?.id,
    });
    if (!updatedGuild) return;
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: {
        embeds: [
          commandHelper.guildSettings.renderGuildSettingsEmbed({
            guildAccount: updatedGuild!,
          }),
        ],
      },
    });
  },
};
