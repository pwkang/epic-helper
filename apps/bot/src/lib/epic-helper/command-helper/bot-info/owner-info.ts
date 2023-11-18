import type {Client} from 'discord.js';
import {broadcastEval} from '../../../../utils/broadcast-eval';
import {BOT_COLOR} from '@epic-helper/constants';
import {EmbedBuilder} from 'discord.js';

interface IOwnerInfo {
  client: Client;
}

export const _ownerInfo = async ({client}: IOwnerInfo) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed);

  const clusters = await broadcastEval({
    client,
    fn: getClusterInfo,
    target: 'all',
  });
  if (!clusters) {
    return embed.addFields({
      name: '**Error**',
      value: 'Failed to fetch data from clusters',
    });
  }
  const summary = clusters.reduce(
    (acc, cluster) => {
      if (cluster.data && typeof cluster.data !== 'string') {
        acc.totalGuilds += cluster.data.totalGuilds;
        acc.totalRam += cluster.data.ramUsage;
      }
      return acc;
    },
    {
      totalGuilds: 0,
      totalRam: 0,
    },
  );
  const summaryValue = [
    `**Guilds**: ${summary.totalGuilds.toLocaleString()}`,
    `**RAM**: ${summary.totalRam.toLocaleString()} MB`,
  ].join('\n');
  embed.addFields({
    name: '**Summary**',
    value: summaryValue,
    inline: true,
  });
  for (const cluster of clusters) {
    if (cluster.data && typeof cluster.data !== 'string') {
      const value = [
        `**Guilds**: ${cluster.data.totalGuilds.toLocaleString()}`,
        `**Uptime**: ${cluster.data.uptime}`,
        `**RAM**: ${cluster.data.ramUsage} MB`,
      ].join('\n');

      embed.addFields({
        name: `**Cluster ${cluster.clusterId}**`,
        value,
        inline: true,
      });
    } else {
      embed.addFields({
        name: `**Cluster ${cluster.clusterId}**`,
        value: '**Error**',
        inline: true,
      });
    }
  }
  return embed;
};

const getClusterInfo = (client: Client) => {
  const totalGuilds = client.guilds.cache.size;
  const uptime = client.utils.getUptime(client);
  const ramUsage = Math.round(process.memoryUsage().rss / 1024 ** 2);

  return {
    totalGuilds,
    uptime,
    ramUsage,
  };
};
