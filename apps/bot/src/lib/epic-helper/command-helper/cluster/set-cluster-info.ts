import type {Client} from 'discord.js';
import {redisCluster} from '@epic-helper/services';
import {randomUUID} from 'crypto';

export const _setClusterInfo = async (client: Client) => {

  const uuid = randomUUID();
  client.clusterSession = uuid;

  if (client.cluster)
    await redisCluster.setCluster(client.cluster?.id, client, uuid);

};
