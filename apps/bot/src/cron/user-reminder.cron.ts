import {userReminderTimesUp} from '../lib/epic-helper/reminders/ready/user.reminder-ready';
import {redisClient} from '@epic-helper/services';
import {redisUserReminder} from '@epic-helper/models';

export default <CronJob>{
  name: 'user-reminder',
  expression: '* * * * * *',
  execute: async (client) => {
    if (!redisClient?.isReady) return;

    const usersId = await redisUserReminder.getReminderTime();
    if (!usersId.length) return;

    usersId.forEach((userId) => {
      userReminderTimesUp(client, userId);
    });
  },
};
