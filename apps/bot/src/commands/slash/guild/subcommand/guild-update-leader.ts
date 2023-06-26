import {IGuildSubCommand} from './type';
import {guildService} from '../../../../services/database/guild.service';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/epic-helper/command-helper';

export const guildUpdateLeader = async ({client, interaction}: IGuildSubCommand) => {
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
};
