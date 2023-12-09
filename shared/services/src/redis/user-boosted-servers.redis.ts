import {redisService} from './redis.service';
import type {IGetUserBoostedServersResponse} from '../database/server.service';
import {toUserBoostedServers} from '../transformer/user-boosted-server.transformer';

const prefix = 'epic-helper:user-boosted-servers:';

const get = async (key: string) => {
  const data = await redisService.get(`${prefix}${key}`);
  if (!data) return null;
  return toUserBoostedServers(JSON.parse(data));
};

const set = async (key: string, data: IGetUserBoostedServersResponse[]) => {
  await redisService.set(`${prefix}${key}`, JSON.stringify(data));
};

const del = async (key: string) => {
  await redisService.del(`${prefix}${key}`);
};

const delMany = async (keys: string[]) => {
  await redisService.del(keys.map((key) => `${prefix}${key}`));
};

export const redisUserBoostedServers = {
  get,
  set,
  del,
  delMany,
};
