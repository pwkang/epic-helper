import {redisClient} from '@epic-helper/services';
import {createJsonBin} from '@epic-helper/utils';

export const _getRedisValues = async (key: string) => {

  const data = await redisClient.get(key);

  if (!data) return null;

  return await createJsonBin(JSON.parse(data));
};
