import {redisClient} from '@epic-helper/services';

export const _deleteRedisValues = async (values: string[]) => {
  let deletedKeys = 0;

  for (const value of values) {
    const keys = await redisClient.keys(value);
    if (!keys.length) continue;
    deletedKeys += keys.length;
    await redisClient.del(keys);
  }

  return deletedKeys;
};
