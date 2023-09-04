import {Client, Embed, EmbedBuilder, Guild, User} from 'discord.js';
import {upgraidService} from '../../../../services/database/upgraid.service';
import {guildService} from '../../../../services/database/guild.service';
import {_renderThisWeekUpgraidListEmbed} from '../../../epic-helper/command-helper/guild/embed/this-week-upgraid-list';
import {djsMessageHelper} from '../../../discordjs/message';
import commandHelper from '../../../epic-helper/command-helper';

interface ISendRecordsToGuildChannel {
  guildServerId: string;
  guildRoleId: string;
  client: Client;
  rpgEmbed: Embed;
  actionChannelId: string;
  author: User;
}

export const _sendUpgraidResultToGuildChannel = async ({
  guildServerId,
  guildRoleId,
  client,
  rpgEmbed,
  actionChannelId,
  author,
}: ISendRecordsToGuildChannel) => {
  const upgraid = await upgraidService.findCurrentUpgraid({
    serverId: guildServerId,
    guildRoleId,
  });
  const guild = await guildService.findGuild({
    serverId: guildServerId,
    roleId: guildRoleId,
  });
  if (!upgraid || !guild) return;
  const upgraidEmbed = _renderThisWeekUpgraidListEmbed({
    guild,
    upgraidList: upgraid,
  });

  const embeds: EmbedBuilder[] = [];

  if (actionChannelId !== guild.upgraid.channelId) {
    const duplicatedEmbed = EmbedBuilder.from(rpgEmbed);
    duplicatedEmbed.setFooter({
      text: `By ${author.username}`,
    });
    embeds.push(duplicatedEmbed);
  }
  embeds.push(upgraidEmbed);

  await djsMessageHelper.send({
    channelId: guild.upgraid.channelId,
    options: {
      embeds,
    },
    client,
  });
};

interface IVerifyGuild {
  client: Client;
  server: Guild;
  author: User;
  channelId: string;
}

export const verifyGuild = async ({author, client, server, channelId}: IVerifyGuild) => {
  const roles = await commandHelper.guild.getUserGuildRoles({
    client,
    userId: author.id,
    server,
  });
  const userGuild = await guildService.findUserGuild({
    userId: author.id,
  });

  if (roles && roles.size > 1) {
    await djsMessageHelper.send({
      channelId,
      client,
      options: {
        embeds: [commandHelper.guild.renderMultipleGuildEmbed(roles)],
      },
    });
    return null;
  }

  if (roles?.size === 1) {
    const guildRole = roles.first()!;
    const guild = await guildService.findGuild({
      serverId: server.id,
      roleId: guildRole.id,
    });

    if (userGuild?.roleId !== guildRole.id)
      await guildService.registerUserToGuild({
        userId: author.id,
        serverId: server.id,
        roleId: guildRole.id,
      });

    if (guild) return guild;
  }

  return userGuild ?? null;
};

interface IRegisterUserToGuild {
  userId: string;
  serverId: string;
  roleId: string;
}

const registerUserToGuild = async ({userId, serverId, roleId}: IRegisterUserToGuild) => {
  const cached = await guildService.findUserGuild({
    userId,
  });
  console.log(cached?.roleId === roleId, cached?.serverId === serverId);
  if (cached?.roleId === roleId && cached?.serverId === serverId) return;
  await guildService.registerUserToGuild({
    userId,
    serverId,
    roleId,
  });
};
