import {Client} from 'discord.js';
import ms from 'ms';
import {redisClient} from '@epic-helper/services';

const prefix = 'epichelper:rpg-message-owner:';

interface IRedisSetRpgMessageOwner {
  client: Client;
  userId: string;
  messageId: string;
}

const setOwner = async ({userId, messageId}: IRedisSetRpgMessageOwner) => {
  await redisClient.set(`${prefix}${messageId}`, userId, {
    PX: ms('5m'),
  });
};

interface IRedisGetRpgMessageOwner {
  client: Client;
  messageId: string;
}

const getOwner = async ({messageId}: IRedisGetRpgMessageOwner) => {
  return await redisClient.get(`${prefix}${messageId}`);
};

const redisRpgMessageOwner = {
  setOwner,
  getOwner,
};

export default redisRpgMessageOwner;
