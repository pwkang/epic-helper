import type {Client, Embed, Guild, User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {upgraidService} from '../../../../services/database/upgraid.service';
import {guildService} from '../../../../services/database/guild.service';
import {_renderThisWeekUpgraidListEmbed} from '../../../epic-helper/command-helper/guild/embed/this-week-upgraid-list';
import {djsMessageHelper} from '../../../discordjs/message';
import commandHelper from '../../../epic-helper/command-helper';
import type {IGuild} from '@epic-helper/models';
import {djsMemberHelper} from '../../../discordjs/member';

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
  author
}: ISendRecordsToGuildChannel) => {
  const upgraid = await upgraidService.findCurrentUpgraid({
    serverId: guildServerId,
    guildRoleId
  });
  const guild = await guildService.findGuild({
    serverId: guildServerId,
    roleId: guildRoleId
  });
  if (!upgraid || !guild) return;
  const upgraidEmbed = _renderThisWeekUpgraidListEmbed({
    guild,
    upgraidList: upgraid
  });

  const embeds: EmbedBuilder[] = [];

  if (actionChannelId !== guild.upgraid.channelId) {
    const duplicatedEmbed = EmbedBuilder.from(rpgEmbed);
    duplicatedEmbed.setFooter({
      text: `By ${author.username}`
    });
    embeds.push(duplicatedEmbed);
  }
  embeds.push(upgraidEmbed);

  await djsMessageHelper.send({
    channelId: guild.upgraid.channelId,
    options: {
      embeds
    },
    client
  });
};

interface IVerifyGuild {
  client: Client;
  server: Guild;
  userId: string;
}

export const verifyGuild = async ({userId, client, server}: IVerifyGuild) => {
  const roles = await getUserGuildRoles({
    client,
    userId,
    server
  });
  const userGuild = await guildService.findUserGuild({
    userId
  });
  let finalGuild: IGuild | null = userGuild;
  let embed: EmbedBuilder | null = null;

  if (roles && roles.size > 1) {
    embed = commandHelper.guild.renderMultipleGuildEmbed(roles);
  } else if (roles?.size === 1) {
    const guildRole = roles.first()!;
    const guild = await guildService.findGuild({
      serverId: server.id,
      roleId: guildRole.id
    });

    if (userGuild?.roleId !== guildRole.id)
      await guildService.registerUserToGuild({
        userId,
        serverId: server.id,
        roleId: guildRole.id
      });
    if (guild) finalGuild = guild;
  }

  if (userGuild && userGuild.serverId === server.id && !roles?.size) {
    await guildService.removeUserFromGuild({
      serverId: server.id,
      roleId: userGuild.roleId,
      userId
    });
  }

  return {
    guild: finalGuild,
    errorEmbed: embed
  };
};

export interface IGetUserGuildRoles {
  client: Client;
  server: Guild;
  userId: string;
}

export const getUserGuildRoles = async ({
  server,
  userId,
  client
}: IGetUserGuildRoles) => {
  const serverMember = await djsMemberHelper.getMember({
    serverId: server.id,
    client,
    userId
  });
  if (!serverMember) return null;
  const guildRoles = await guildService.getAllGuildRoles({serverId: server.id});
  return serverMember.roles.cache.filter((userRole) =>
    guildRoles.some((guildRole) => userRole.id === guildRole)
  );
};
