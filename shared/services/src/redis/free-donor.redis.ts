import {redisService} from './redis.service';
import type {IFreeDonor} from '@epic-helper/models';
import {toFreeDonor} from '../transformer/free-donor.transformer';

const freeDonorPrefix = 'epic-helper:free-donor:';

const findFreeDonor = async (userId: string) => {
  const data = await redisService.get(`${freeDonorPrefix}:${userId}`);
  if (!data) return null;
  return toFreeDonor(JSON.parse(data));
};

const setFreeDonor = async (userId: string, donor: IFreeDonor) => {
  await redisService.set(
    `${freeDonorPrefix}:${userId}`,
    JSON.stringify(toFreeDonor(donor)),
  );
};

const delFreeDonor = async (userId: string) => {
  await redisService.del(`${freeDonorPrefix}:${userId}`);
};

const delFreeDonors = async (usersId: string[]) => {
  await redisService.del(
    usersId.map((userId) => `${freeDonorPrefix}:${userId}`),
  );
};

export const redisFreeDonor = {
  findFreeDonor,
  setFreeDonor,
  delFreeDonor,
  delFreeDonors,
};
