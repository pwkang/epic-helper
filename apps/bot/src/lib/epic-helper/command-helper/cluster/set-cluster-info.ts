import type {Client} from 'discord.js';
import {redisCluster} from '../../../../services/redis/cluster.redis';

export const _setClusterInfo = async (client: Client) => {
  if (client.cluster)
    await redisCluster.setCluster(client.cluster?.id, client);

};
