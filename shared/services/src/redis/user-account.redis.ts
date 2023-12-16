import type {IUser} from '@epic-helper/models';
import {redisService} from './redis.service';
import {toUser, toUsers} from '../transformer/user.transformer';

const userAccPrefix = 'epic-helper:user:';
const findUser = async (userId: string) => {
  const data = await redisService.get(`${userAccPrefix}:${userId}`);
  if (!data) return null;
  return toUser(JSON.parse(data));
};

const setUser = async (userId: string, user: IUser) => {
  await redisService.set(
    `${userAccPrefix}:${userId}`,
    JSON.stringify(toUser(user)),
  );
};

const delUser = async (userId: string) => {
  await redisService.del(`${userAccPrefix}:${userId}`);
};

const getAllUsers = async (size: number, excluded?: string[]) => {
  let keys = await redisService.keys(`${userAccPrefix}*`);
  keys = keys
    .filter((key) => {
      const userId = key.split(':')[1];
      return !excluded?.includes(userId);
    })
    .slice(0, size);

  const users = await Promise.all(
    keys.map(async (key) => {
      const data = await redisService.get(key);
      if (!data) return null;
      return JSON.parse(data);
    }),
  );
  return toUsers(users.filter((user) => user !== null));
};

const redisUserAccount = {
  findUser,
  setUser,
  delUser,
  getAllUsers,
};

export default redisUserAccount;
