import {redisClient} from '../services/redis/redis.service';
import {redisGetReadyUserReminder} from '../services/redis/user-reminder.redis';

export default <CronJob>{
  name: 'user-reminder',
  expression: '* * * * * *',
  execute: async (client) => {
    if (!redisClient?.isReady) return;

    const usersId = await redisGetReadyUserReminder();
  },
};
