import {userReminderTimesUp} from '../lib/epic-helper/reminders/ready/user.reminder-ready';
import {redisUserReminder} from '../services/redis/user-reminder.redis';
import {redisService} from '../services/redis/redis.service';

export default <CronJob>{
  name: 'user-reminder',
  expression: '* * * * * *',
  execute: async (client) => {
    if (!redisService?.isReady) return;

    const usersId = await redisUserReminder.getReminderTime();
    if (!usersId.length) return;
    usersId.forEach((userId) => {
      userReminderTimesUp(client, userId);
    });
  },
};
