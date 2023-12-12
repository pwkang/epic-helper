import type {Client} from 'discord.js';
import {redisCluster} from '@epic-helper/services';

export const _isClusterActive = async (client: Client) => {
  if (!client.cluster) return true;
  if (!client.isReady()) return false;

  const clusterInfo = await redisCluster.findCluster(client.cluster?.id);

  return clusterInfo?.activeSession === client.clusterSession;
};
