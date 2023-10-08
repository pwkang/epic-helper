import type {IUser} from '@epic-helper/models';
import {redisService} from './redis.service';
import {toUser} from '../transformer/user.transformer';

const userAccPrefix = 'epic-helper:user:';
const findUser = async (userId: string) => {
  const data = await redisService.get(`${userAccPrefix}:${userId}`);
  if (!data) return null;
  return toUser(JSON.parse(data));
};

const setUser = async (userId: string, user: IUser) => {
  await redisService.set(
    `${userAccPrefix}:${userId}`,
    JSON.stringify(toUser(user))
  );
};

const delUser = async (userId: string) => {
  await redisService.del(`${userAccPrefix}:${userId}`);
};

const redisUserAccount = {
  findUser,
  setUser,
  delUser,
};

export default redisUserAccount;
