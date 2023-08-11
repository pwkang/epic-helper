import {Client, Embed, EmbedBuilder, Guild, User} from 'discord.js';
import {upgraidService} from '../../../../services/database/upgraid.service';
import {guildService} from '../../../../services/database/guild.service';
import {_renderThisWeekUpgraidListEmbed} from '../../../epic-helper/command-helper/guild/embed/this-week-upgraid-list';
import {djsMessageHelper} from '../../../discordjs/message';
import commandHelper from '../../../epic-helper/command-helper';

interface ISendRecordsToGuildChannel {
  serverId: string;
  guildRoleId: string;
  client: Client;
  rpgEmbed: Embed;
  actionChannelId: string;
}

export const _sendUpgraidResultToGuildChannel = async ({
  serverId,
  guildRoleId,
  client,
  rpgEmbed,
  actionChannelId,
}: ISendRecordsToGuildChannel) => {
  const upgraid = await upgraidService.findCurrentUpgraid({
    serverId,
    guildRoleId,
  });
  const guild = await guildService.findGuild({
    serverId,
    roleId: guildRoleId,
  });
  if (!upgraid || !guild) return;
  const upgraidEmbed = _renderThisWeekUpgraidListEmbed({
    guild,
    upgraidList: upgraid,
  });

  const embeds: EmbedBuilder[] = [];

  if (actionChannelId !== guild.upgraid.channelId) {
    embeds.push(EmbedBuilder.from(rpgEmbed));
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

interface ICheckUserGuildRoles {
  client: Client;
  author: User;
  server: Guild;
  channelId: string;
}

export const _checkUserGuildRoles = async ({
  client,
  author,
  server,
  channelId,
}: ICheckUserGuildRoles) => {
  const roles = await commandHelper.guild.getUserGuildRoles({
    client,
    userId: author.id,
    server,
  });
  if (!roles || !roles.size) return;
  if (roles.size > 1) {
    await djsMessageHelper.send({
      channelId,
      client,
      options: {
        embeds: [commandHelper.guild.renderMultipleGuildEmbed(roles)],
      },
    });
    return null;
  }
  return roles.first()!.id;
};
