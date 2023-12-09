import {redisService} from './redis.service';
import type {Client} from 'discord.js';

const prefix = 'epic-helper:cluster:';

const findCluster = async (clusterId: number) => {
  const data = await redisService.get(`${prefix}${clusterId}`);
  if (!data) return null;
  return toCluster(JSON.parse(data));
};

const setCluster = async (clusterId: number, client: Client, uuid: string) => {
  const data = getClusterData(client, clusterId, uuid);
  await redisService.set(`${prefix}${clusterId}`, JSON.stringify(data));
};

const getClusterData = (client: Client, clusterId: number, uuid: string) => {
  return {
    clusterId,
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
