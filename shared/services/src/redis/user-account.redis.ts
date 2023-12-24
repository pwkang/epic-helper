import type {IUser} from '@epic-helper/models';
import {redisService} from './redis.service';
import {toUser} from '../transformer/user.transformer';

const userAccPrefix = 'epic-helper:user:';

const getKey = (userId: string) => {
  return `${userAccPrefix}${userId}`;
};

const findUser = async (userId: string) => {
  const data = await redisService.get(getKey(userId));
  if (!data) return null;
  return toUser(JSON.parse(data));
};

const setUser = async (userId: string, user: IUser) => {
  await redisService.set(
    getKey(userId),
    JSON.stringify(toUser(user)),
  );
};

const delUser = async (userId: string) => {
  await redisService.del(getKey(userId));
};

const redisUserAccount = {
  findUser,
  setUser,
  delUser,
};

export default redisUserAccount;
