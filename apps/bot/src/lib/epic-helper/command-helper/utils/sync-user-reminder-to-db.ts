import {redisUserReminder} from '@epic-helper/services/dist/redis/user-reminder.redis';
import {userReminderServices} from '@epic-helper/services';
import ms from 'ms';

const MINIMUM_UPDATE_INTERVAL = ms('1m');

export const _syncUserReminderToDb = async () => {
  const reminders = await redisUserReminder.getAllReminders();
  if (!reminders.length) return 0;

  const toUpdate = reminders.filter(reminder =>
    reminder.updatedAt &&
    reminder.updatedAt.getTime() > new Date().getTime() - MINIMUM_UPDATE_INTERVAL,
  );

  if (!toUpdate.length) return 0;

  await userReminderServices.saveRemindersToDb({
    reminders: toUpdate,
  });

  return toUpdate.length;
};
