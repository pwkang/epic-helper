import ms from 'ms';
import {redisService} from './redis.service';

const prefix = 'epic-helper:message-edited:';

interface IRedisSetMessageEdited {
  messageId: string;
}

const register = async ({messageId}: IRedisSetMessageEdited) => {
  await redisService.set(`${prefix}${messageId}`, messageId, {
    PX: ms('5m'),
  });
};

interface IRedisGetMessageEdited {
  messageId: string;
}

const isEdited = async ({messageId}: IRedisGetMessageEdited) => {
  return await redisService.get(`${prefix}${messageId}`);
};

export const redisMessageEdited = {
  register,
  isEdited,
};
