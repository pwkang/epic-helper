import type {BaseInteraction, BaseMessageOptions, Client, Guild, User} from 'discord.js';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} from 'discord.js';
import {guildDuelService, guildService} from '@epic-helper/services';
import {BOT_COLOR} from '@epic-helper/constants';
import messageFormatter from '../../../discordjs/message-formatter';
import {userChecker} from '../../user-checker';

interface IResetDuelRecord {
  client: Client;
  server: Guild;
  roleId: string;
  author: User;
}

export const _resetDuelRecord = async ({
  roleId,
  server,
  author,
  client,
}: IResetDuelRecord) => {
  const guildAccount = await guildService.findGuild({
    roleId,
    serverId: server.id,
  });
  const isServerAdmin = await userChecker.isServerAdmin({
    client,
    serverId: server.id,
    userId: author.id,
  });
  const isGuildLeader = await userChecker.isGuildLeader({
    userId: author.id,
    serverId: server.id,
    guildRoleId: roleId,
  });

  const render = () => {
    if (!guildAccount) {
      return {
        content: 'There is no guild with this role',
      };
    }
    if (!isServerAdmin) {
      return {
        content: 'You do not have permission to modify duel record.',
      };
    }
    if (!isServerAdmin && !isGuildLeader) {
      return {
        content: 'Nice try... You are not the guild leader',
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
          serverId: server.id,
          roleId,
        });
        return generateResultOptions({
          deleted: true,
          roleId,
          author,
        });
      case 'no':
        return generateResultOptions({
          deleted: false,
          roleId,
          author,
        });
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

const generateConfirmationOptions = ({
  roleId,
}: IGenerateConfirmationEmbed): BaseMessageOptions => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setDescription(
      `Are you sure want to reset duel record for ${messageFormatter.role(
        roleId,
      )}?`,
    );

  const rows = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('yes')
      .setLabel('Yes')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('no')
      .setLabel('No')
      .setStyle(ButtonStyle.Danger),
  );

  return {
    embeds: [embed],
    components: [rows],
  };
};

interface IGenerateResultOptions {
  deleted: boolean;
  roleId: string;
  author: User;
}

const generateResultOptions = ({
  roleId,
  deleted,
  author,
}: IGenerateResultOptions): BaseMessageOptions => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed);
  if (deleted) {
    embed.setDescription(
      `Successfully reset duel record for ${messageFormatter.role(roleId)}`,
    );
    embed.setFooter({text: `Reset by ${author.username}`});
  } else {
    embed.setDescription('Cancelled');
  }
  return {
    embeds: [embed],
    components: [],
  };
};
