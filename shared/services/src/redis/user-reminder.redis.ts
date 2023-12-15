import type {ValuesOf} from '@epic-helper/types';
import type {RPG_COMMAND_TYPE} from '@epic-helper/constants';
import {redisService} from './redis.service';
import {toUserReminder, toUserReminders} from '../transformer/user-reminder.transformer';

const PREFIX = 'epic-helper:user-reminder:';

const getReminderKey = (userId: string, type: ValuesOf<typeof RPG_COMMAND_TYPE>) => {
  return `${PREFIX}${userId}:${type}`;
};

const getReminder = async (userId: string, type: ValuesOf<typeof RPG_COMMAND_TYPE>) => {
  const data = await redisService.get(getReminderKey(userId, type));
  if (!data) return null;
  return toUserReminder(JSON.parse(data));
};

const getReminders = async (userId: string) => {
  const keys = await redisService.keys(`${PREFIX}${userId}:*`);
  const reminders = await Promise.all(
    keys.map(async (key) => {
      const data = await redisService.get(key);
      if (!data) return null;
      return JSON.parse(data);
    }),
  );
  return toUserReminders(reminders.filter((reminder) => reminder !== null));
};

const setReminder = async (userId: string, type: ValuesOf<typeof RPG_COMMAND_TYPE>, value: any) => {
  await redisService.set(getReminderKey(userId, type), JSON.stringify(value));
};

const clearReminders = async (userId: string, types: ValuesOf<typeof RPG_COMMAND_TYPE>[]) => {
  await redisService.del(types.map((type) => getReminderKey(userId, type)));
};
export const redisUserReminder = {
  getReminder,
  getReminders,
  setReminder,
  clearReminders,
};
