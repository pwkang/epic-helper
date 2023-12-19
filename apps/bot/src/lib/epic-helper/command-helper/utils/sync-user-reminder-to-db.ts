import {redisUserReminder} from '@epic-helper/services/dist/redis/user-reminder.redis';
import {userReminderServices} from '@epic-helper/services';
import ms from 'ms';

const MINIMUM_UPDATE_INTERVAL = ms('1m');

const BATCH_SIZE = 100;

export const _syncUserReminderToDb = async () => {
  let updated = 0;
  const updatedUsersId = new Set<string>();
  while (1) {
    const reminders = await redisUserReminder.getAllReminders(BATCH_SIZE, Array.from(updatedUsersId));
    if (!reminders.length) break;
    reminders.forEach(reminder => updatedUsersId.add(reminder.userId));

    const toUpdate = reminders.filter(reminder =>
      reminder.updatedAt &&
      reminder.updatedAt.getTime() > new Date().getTime() - MINIMUM_UPDATE_INTERVAL,
    );

    if (!toUpdate.length) break;

    await userReminderServices.saveRemindersToDb({
      reminders: toUpdate,
    });

    updated += toUpdate.length;
  }

  return updated;
};
