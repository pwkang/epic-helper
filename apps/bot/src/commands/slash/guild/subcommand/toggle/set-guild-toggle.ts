import {IGuildSubCommand} from '../type';
import {guildService} from '../../../../../services/database/guild.service';
import djsInteractionHelper from '../../../../../lib/discordjs/interaction';
import commandHelper from '../../../../../lib/epic-helper/command-helper';
import {toggleDisplayList} from '../../../../../lib/epic-helper/command-helper/toggle/toggle.list';
import {IGuild} from '@epic-helper/models';

export const setGuildToggle = async ({client, interaction}: IGuildSubCommand) => {
  if (!interaction.inGuild()) return;
  const guildRole = interaction.options.getRole('role', true);
  const onStr = interaction.options.getString('on');
  const offStr = interaction.options.getString('off');

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

  const query = commandHelper.toggle.getUpdateQuery<IGuild>({
    off: offStr ? offStr : undefined,
    on: onStr ? onStr : undefined,
    toggleInfo: toggleDisplayList.guild(guildAccount.toggle),
  });
  const updatedGuildAccount = await guildService.updateToggle({
    query,
    roleId: guildRole.id,
    serverId: interaction.guildId,
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
