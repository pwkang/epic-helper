import {Client} from 'discord.js';
import {redisClient} from './redis.service';
import ms from 'ms';

const prefix = 'epichelper:rpg-message-owner:';

interface IRedisSetRpgMessageOwner {
  client: Client;
  userId: string;
  messageId: string;
}

export const redisSetRpgMessageOwner = async ({userId, messageId}: IRedisSetRpgMessageOwner) => {
  await redisClient.set(`${prefix}${messageId}`, userId, {
    PX: ms('5m'),
  });
};

interface IRedisGetRpgMessageOwner {
  client: Client;
  messageId: string;
}

export const redisGetRpgMessageOwner = async ({messageId}: IRedisGetRpgMessageOwner) => {
  return await redisClient.get(`${prefix}${messageId}`);
};
