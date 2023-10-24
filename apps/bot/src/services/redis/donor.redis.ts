import {redisService} from './redis.service';
import {toDonor} from '../transformer/donor.transformer';
import type {IDonor} from '@epic-helper/models';

const donorPrefix = 'epic-helper:donor:';

const findDonor = async (userId: string) => {
  const data = await redisService.get(`${donorPrefix}:${userId}`);
  if (!data) return null;
  return toDonor(JSON.parse(data));
};

const setDonor = async (userId: string, donor: IDonor) => {
  await redisService.set(
    `${donorPrefix}:${userId}`,
    JSON.stringify(toDonor(donor)),
  );
};

const delDonor = async (userId: string) => {
  await redisService.del(`${donorPrefix}:${userId}`);
};

export const redisDonor = {
  findDonor,
  setDonor,
  delDonor,
};
