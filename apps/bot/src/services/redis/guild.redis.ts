import type {IGuild} from '@epic-helper/models';
import {redisService} from './redis.service';
import {toGuild} from '../transformer/guild.transformer';

const PREFIX = 'epic-helper:guild:';

const getKey = (serverId: string, roleId: string) =>
  `${PREFIX}${serverId}:${roleId}`;

const setGuild = async (serverId: string, roleId: string, guild: IGuild) => {
  const key = getKey(serverId, roleId);
  const formattedGuild = toGuild(guild);
  await redisService.set(key, JSON.stringify(formattedGuild));
  return formattedGuild;
};

const getGuild = async (
  serverId: string,
  roleId: string
): Promise<IGuild | null> => {
  const key = getKey(serverId, roleId);
  const guild = await redisService.get(key);
  return guild ? toGuild(JSON.parse(guild)) : null;
};

const delGuild = async (serverId: string, roleId: string) => {
  const key = getKey(serverId, roleId);
  await redisService.del(key);
};

export const redisGuild = {
  setGuild,
  getGuild,
  delGuild,
};
