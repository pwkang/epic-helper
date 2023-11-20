import {redisService} from './redis.service';
import type {Client} from 'discord.js';
import {randomUUID} from 'crypto';

const prefix = 'epic-helper:cluster:';

const findCluster = async (clusterId: number) => {
  const data = await redisService.get(`${prefix}${clusterId}`);
  if (!data) return null;
  return toCluster(JSON.parse(data));
};

const setCluster = async (clusterId: number, client: Client) => {
  const data = getClusterData(client);
  await redisService.set(`${prefix}${clusterId}`, JSON.stringify(data));
};

const getClusterData = (client: Client) => {
  const uuid = randomUUID();
  client.clusterSession = uuid;

  return {
    clusterId: client.cluster?.id,
    activeSession: uuid,
  };
};

const toCluster = (data: any) => {
  return {
    clusterId: data.clusterId,
    activeSession: data.activeSession,
  };
};

export const redisCluster = {
  findCluster,
  setCluster,
};
