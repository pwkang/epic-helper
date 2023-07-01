import {IGuildSubCommand} from '../type';
import {guildService} from '../../../../../services/database/guild.service';
import djsInteractionHelper from '../../../../../lib/discordjs/interaction';
import commandHelper from '../../../../../lib/epic-helper/command-helper';

export const resetGuildToggle = async ({client, interaction}: IGuildSubCommand) => {
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
};
