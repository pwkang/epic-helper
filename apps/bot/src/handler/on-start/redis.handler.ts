import {redisService} from '@epic-helper/services';

export const loadRedis = async () => {
  await redisService.connect();
};
