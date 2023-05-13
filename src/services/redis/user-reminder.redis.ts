import {redisClient} from './redis.service';

const prefix = 'epic-helper:user-reminder:';

interface IRedisUserReminder {
  userId: string;
  readyAt: Date;
}

export const redisUpdateUserNextReminderTime: (
  userId: string,
  readyAt: Date
) => Promise<void> = async (userId, readyAt) => {
  const data: IRedisUserReminder = {
    readyAt,
    userId,
  };
  await redisClient.set(`${prefix}${userId}`, JSON.stringify(data));
};

export const redisGetReadyUserReminder: () => Promise<string[]> = async () => {
  const keys = await redisClient.keys(`${prefix}*`);
  const usersId = await Promise.all(
    keys.map(async (key) => {
      const data = await redisClient.get(key);
      if (!data) return '';
      const {readyAt, userId} = JSON.parse(data) as IRedisUserReminder;
      if (new Date(readyAt) > new Date()) return '';
      await redisClient.del(key);
      return userId;
    })
  );
  return usersId.filter((id) => id !== '');
};

export const redisDeleteUserNextReminderTime: (userId: string) => Promise<void> = async (
  userId
) => {
  await redisClient.del(`${prefix}${userId}`);
};
