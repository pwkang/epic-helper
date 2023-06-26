import {IGuildSubCommand} from './type';
import {guildService} from '../../../../services/database/guild.service';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} from 'discord.js';
import {BOT_COLOR} from '@epic-helper/constants';
import messageFormatter from '../../../../lib/discordjs/message-formatter';

export const deleteGuild = async ({client, interaction}: IGuildSubCommand) => {
  const role = interaction.options.getRole('role', true);
  const guildAccount = await guildService.findGuild({
    roleId: role.id,
    serverId: interaction.guildId!,
  });
  if (!guildAccount)
    return djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: {
        content: `There is no guild with role ${role} setup in this server`,
        ephemeral: true,
      },
    });
  const embed = await commandHelper.guildSettings.renderGuildSettingsEmbed({
    guildAccount: guildAccount,
  });
  const event = await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: {
      content: 'Are you sure you want to delete this guild?',
      embeds: [embed],
      components: [actionRow],
    },
    interactive: true,
  });
  if (!event) return;
  event.on('yes', async () => {
    await guildService.deleteGuild({
      roleId: role.id,
      serverId: interaction.guildId!,
    });
    return {
      content: '',
      embeds: [
        new EmbedBuilder()
          .setDescription(`Successfully deleted guild - ${messageFormatter.role(role.id)}`)
          .setColor(BOT_COLOR.embed),
      ],
      components: [],
    };
  });
  event.on('no', async () => {
    return {
      content: `Cancelled`,
      embeds: [],
      components: [],
    };
  });
};

const actionRow = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    new ButtonBuilder().setCustomId('yes').setLabel('Yes').setStyle(ButtonStyle.Success)
  )
  .addComponents(new ButtonBuilder().setCustomId('no').setLabel('No').setStyle(ButtonStyle.Danger));
