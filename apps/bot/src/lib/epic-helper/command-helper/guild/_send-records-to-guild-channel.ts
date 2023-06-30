import {upgraidService} from '../../../../services/database/upgraid.service';
import {guildService} from '../../../../services/database/guild.service';
import {djsMessageHelper} from '../../../discordjs/message';
import {Client} from 'discord.js';
import {_renderThisWeekUpgraidListEmbed} from './embed/this-week-upgraid-list';

interface ISendRecordsToGuildChannel {
  serverId: string;
  guildRoleId: string;
  client: Client;
}

export const _sendRecordsToGuildChannel = async ({
  serverId,
  guildRoleId,
  client,
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
  await djsMessageHelper.send({
    channelId: guild.upgraid.channelId,
    options: {
      embeds: [upgraidEmbed],
    },
    client,
  });
};
