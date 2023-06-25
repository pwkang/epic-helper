import {IGuildSubCommand} from './type';
import {guildService} from '../../../../services/database/guild.service';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/epic-helper/command-helper';

export const guildSetup = async ({client, interaction}: IGuildSubCommand) => {
  const role = interaction.options.getRole('role')!;
  const leader = interaction.options.getUser('leader') ?? undefined;

  const isRoleUsed = await guildService.isRoleUsed({
    serverId: interaction.guildId!,
    roleId: role.id,
  });

  if (isRoleUsed) {
    return djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: {
        content: `Role ${role} is already used by another guild`,
        ephemeral: true,
      },
    });
  }
  const newGuild = await guildService.registerGuild({
    serverId: interaction.guildId!,
    roleId: role.id,
    leaderId: leader?.id,
  });
  djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: {
      embeds: [
        commandHelper.guildSettings.renderGuildSettingsEmbed({
          guildAccount: newGuild,
        }),
      ],
    },
  });
};
