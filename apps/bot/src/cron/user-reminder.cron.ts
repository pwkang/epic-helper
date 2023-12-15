import {userReminderTimesUp} from '../lib/epic-helper/reminders/ready/user.reminder-ready';
import commandHelper from '../lib/epic-helper/command-helper';
import {redisService, redisUserNextReminderTime} from '@epic-helper/services';

export default <CronJob>{
  name: 'user-reminder',
  expression: '* * * * * *',
  execute: async (client) => {
    if (!redisService?.isReady) return;

    const isClusterActive = await commandHelper.cluster.isClusterActive(client);
    if (!isClusterActive) return;

    const usersId = await redisUserNextReminderTime.getReminderTime();
    if (!usersId.length) return;
    usersId.forEach((userId) => {
      userReminderTimesUp(client, userId);
    });
  },
};
