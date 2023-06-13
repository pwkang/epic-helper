import {redisClient} from '../services/redis/redis.service';
import redisUserReminder from '../services/redis/user-reminder.redis';
import {userReminderTimesUp} from '../lib/epic-helper/reminders/ready/user.reminder-ready';

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
