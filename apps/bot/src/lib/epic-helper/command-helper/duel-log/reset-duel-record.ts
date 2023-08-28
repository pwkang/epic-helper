import {
  ActionRowBuilder,
  BaseInteraction,
  BaseMessageOptions,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  User,
} from 'discord.js';
import {guildService} from '../../../../services/database/guild.service';
import {BOT_COLOR} from '@epic-helper/constants';
import messageFormatter from '../../../discordjs/message-formatter';
import {guildDuelService} from '../../../../services/database/guild-duel.service';

interface IResetDuelRecord {
  client: Client;
  serverId: string;
  roleId: string;
  author: User;
}

export const _resetDuelRecord = async ({roleId, serverId}: IResetDuelRecord) => {
  const guildAccount = await guildService.findGuild({
    roleId,
    serverId,
  });
  const render = () => {
    if (!guildAccount) {
      return {
        content: 'There is no guild with this role',
      };
    }
    return generateConfirmationOptions({roleId});
  };

  const replyInteraction = async ({
    interaction,
  }: {
    interaction: BaseInteraction;
  }): Promise<BaseMessageOptions | null> => {
    if (!interaction.isButton()) return null;
    const customId = interaction.customId;
    switch (customId) {
      case 'yes':
        await guildDuelService.resetGuildDuel({
          serverId,
          roleId,
        });
        return generateResultOptions(true, roleId);
      case 'no':
        return generateResultOptions(false, roleId);
    }
    return null;
  };

  return {
    render,
    replyInteraction,
  };
};

interface IGenerateConfirmationEmbed {
  roleId: string;
}

const generateConfirmationOptions = ({roleId}: IGenerateConfirmationEmbed): BaseMessageOptions => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setDescription(`Are you sure want to reset duel record for ${messageFormatter.role(roleId)}?`);

  const rows = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId('yes').setLabel('Yes').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('no').setLabel('No').setStyle(ButtonStyle.Danger)
  );

  return {
    embeds: [embed],
    components: [rows],
  };
};

const generateResultOptions = (deleted: boolean, roleId: string): BaseMessageOptions => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed);
  if (deleted) {
    embed.setDescription(`Successfully reset duel record for ${messageFormatter.role(roleId)}`);
  } else {
    embed.setDescription('Cancelled');
  }
  return {
    embeds: [embed],
    components: [],
  };
};
