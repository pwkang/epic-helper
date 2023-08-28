import {Client, EmbedBuilder} from 'discord.js';
import {guildService} from '../../../../services/database/guild.service';
import {djsMessageHelper} from '../../../discordjs/message';

interface ISendDuelLog {
  embed: EmbedBuilder;
  serverId: string;
  roleId: string;
  client: Client;
}

export const sendDuelLog = async ({embed, serverId, roleId, client}: ISendDuelLog) => {
  const guild = await guildService.findGuild({
    roleId,
    serverId,
  });
  const logChannel = guild?.duel?.channelId;

  if (!logChannel) return;

  await djsMessageHelper.send({
    client,
    options: {
      embeds: [embed],
    },
    channelId: logChannel,
  });
};