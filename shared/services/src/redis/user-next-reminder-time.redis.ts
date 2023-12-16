import {redisService} from './redis.service';

const prefix = 'epic-helper:user-reminder-time:';

interface IRedisUserReminder {
  userId: string;
  readyAt: Date;
}

const setReminderTime: (
  userId: string,
  readyAt: Date
) => Promise<void> = async (userId, readyAt) => {
  const data: IRedisUserReminder = {
    readyAt,
    userId,
  };
  await redisService.set(`${prefix}${userId}`, JSON.stringify(data));
};

const getReminderTime: () => Promise<string[]> = async () => {
  const keys = await redisService.keys(`${prefix}*`);
  const usersId = await Promise.all(
    keys.map(async (key) => {
      const data = await redisService.get(key);
      if (!data) return '';
      const {readyAt, userId} = JSON.parse(data) as IRedisUserReminder;
      if (new Date(readyAt) > new Date()) return '';
      return userId;
    }),
  );
  return usersId.filter((id) => id !== '');
};

const deleteReminderTime: (userId: string) => Promise<void> = async (
  userId,
) => {
  await redisService.del(`${prefix}${userId}`);
};

const findUserReminderTime: (userId: string) => Promise<Date | null> = async (
  userId,
) => {
  const data = await redisService.get(`${prefix}${userId}`);
  if (!data) return null;
  const {readyAt} = JSON.parse(data) as IRedisUserReminder;
  return new Date(readyAt);
};

export const redisUserNextReminderTime = {
  setReminderTime,
  getReminderTime,
  deleteReminderTime,
  findUserReminderTime,
};
