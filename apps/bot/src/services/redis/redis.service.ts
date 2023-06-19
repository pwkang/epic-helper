import {createClient} from 'redis';
import * as dotenv from 'dotenv';
import {logger} from '@epic-helper/utils';

dotenv.config();

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('connect', () => {
  logger({
    message: 'Connected to Redis',
  });
});

redisClient.on('error', (err) => {
  logger({
    message: err.message,
    logLevel: 'error',
  });
});
