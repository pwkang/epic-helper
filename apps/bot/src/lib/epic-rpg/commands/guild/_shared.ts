import type {Client, Embed, User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {upgraidService} from '../../../../services/database/upgraid.service';
import {guildService} from '../../../../services/database/guild.service';
import {_renderThisWeekUpgraidListEmbed} from '../../../epic-helper/command-helper/guild/embed/this-week-upgraid-list';
import {djsMessageHelper} from '../../../discordjs/message';

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
