import type {Client} from 'discord.js';
import {redisCluster} from '../../../../services/redis/cluster.redis';

export const _isClusterActive = async (client: Client) => {
  if (!client.cluster) return true;
  const clusterInfo = await redisCluster.findCluster(client.cluster?.id);

  return clusterInfo?.activeSession === client.clusterSession;
};
