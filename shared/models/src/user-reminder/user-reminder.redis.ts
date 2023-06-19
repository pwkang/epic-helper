import {redisClient} from '@epic-helper/services/src';

const prefix = 'epic-helper:user-reminder:';

interface IRedisUserReminder {
  userId: string;
  readyAt: Date;
}

const setReminderTime: (userId: string, readyAt: Date) => Promise<void> = async (
  userId,
  readyAt
) => {
  const data: IRedisUserReminder = {
    readyAt,
    userId,
  };
  await redisClient.set(`${prefix}${userId}`, JSON.stringify(data));
};

const getReminderTime: () => Promise<string[]> = async () => {
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

const deleteReminderTime: (userId: string) => Promise<void> = async (userId) => {
  await redisClient.del(`${prefix}${userId}`);
};

export const redisUserReminder = {
  setReminderTime,
  getReminderTime,
  deleteReminderTime,
};
