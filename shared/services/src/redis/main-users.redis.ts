import {redisService} from './redis.service';

const PREFIX = 'epic-helper:main-users:';

interface IRedisMainUsers {
  users: string[];
}

const get = async (clusterId: number = -1) => {
  const data = await redisService.get(`${PREFIX}${clusterId}`);
  if (!data) return [];
  const {users} = JSON.parse(data) as IRedisMainUsers;
  return users;
};

const set = async (clusterId: number = -1, users: string[]) => {
  const data: IRedisMainUsers = {
    users,
  };
  await redisService.set(`${PREFIX}${clusterId}`, JSON.stringify(data));
};

export const redisMainUsers = {
  get,
  set,
};
