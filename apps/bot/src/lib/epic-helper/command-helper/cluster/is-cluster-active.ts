import type {Client} from 'discord.js';
import {redisCluster} from '../../../../services/redis/cluster.redis';
import {mongoClient} from '@epic-helper/services';
import {logger} from '@epic-helper/utils';

export const _isClusterActive = async (client: Client) => {
  if (!client.cluster) return true;
  if(!client.isReady()) return false;
  const clusterInfo = await redisCluster.findCluster(client.cluster?.id);

  const isActive = clusterInfo?.activeSession === client.clusterSession;

  if(!isActive) {
    try{
      if(mongoClient.readyState === 1)
        await mongoClient.close();
    }catch(e){
      logger({
        clusterId: client.cluster?.id,
        logLevel: 'warn',
        variant: 'cluster',
        message: 'MongoDB connection is already closed',
      });
    }
  }

  return isActive;
};
