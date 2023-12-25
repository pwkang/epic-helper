import {redisService} from './redis.service';

const prefix = 'epic-helper:user-reminder:';

interface IRedisUserReminder {
  userId: string;
  readyAt: Date;
}

const setReminderTime = async (userId: string, readyAt: Date) => {
  const data: IRedisUserReminder = {
    readyAt,
    userId,
  };
  await redisService.set(`${prefix}${userId}`, JSON.stringify(data));
};

const getReminderTime = async (usersIdSet: Set<string>) => {
  let keys = await redisService.keys(`${prefix}*`);
  keys = keys.filter((key) => usersIdSet.has(key.replace(prefix, '')));
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

export const redisUserReminder = {
  setReminderTime,
  getReminderTime,
  deleteReminderTime,
};
