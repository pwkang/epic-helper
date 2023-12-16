import {redisUserReminder} from '@epic-helper/services/dist/redis/user-reminder.redis';
import ms from 'ms';
import {userReminderServices} from '@epic-helper/services';

const MINIMUM_UPDATE_INTERVAL = ms('1m');

export default <CronJob>{
  name: 'save-reminder-info',
  expression: '0 * * * * *',
  clusterId: 0,
  cronOptions: {},
  execute: async () => {

    const reminders = await redisUserReminder.getAllReminders();
    if (!reminders.length) return;

    const toUpdate = reminders.filter(reminder =>
      reminder.updatedAt &&
      reminder.updatedAt.getTime() > new Date().getTime() - MINIMUM_UPDATE_INTERVAL,
    );

    if (!toUpdate.length) return;

    await userReminderServices.saveRemindersToDb({
      reminders: toUpdate,
    });
  },
};
