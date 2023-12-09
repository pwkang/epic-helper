import {redisService} from '@epic-helper/services/dist/redis/redis.service';

export const loadRedis = async () => {
  await redisService.connect();
};
