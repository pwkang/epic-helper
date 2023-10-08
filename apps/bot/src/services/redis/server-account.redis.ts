import type {IServer} from '@epic-helper/models';
import {redisService} from './redis.service';
import {toServer} from '../transformer/server.transformer';

const PREFIX = 'epic-helper:server:';

const setServer = async (serverId: string, server: IServer) => {
  await redisService.set(getKey(serverId), JSON.stringify(toServer(server)));
};

const getServer = async (serverId: string) => {
  const data = await redisService.get(getKey(serverId));
  return data ? toServer(JSON.parse(data)) : null;
};

const delServer = async (serverId: string) => {
  await redisService.del(getKey(serverId));
};

const getKey = (serverId: string) => `${PREFIX}${serverId}`;

export const redisServerAccount = {
  setServer,
  getServer,
  delServer
};
