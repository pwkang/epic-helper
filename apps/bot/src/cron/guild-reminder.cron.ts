import {redisService} from '../services/redis/redis.service';
import {logger} from '@epic-helper/utils';
import {redisGuildReminder} from '../services/redis/guild-reminder.redis';
import {guildReminderTimesUp} from '../lib/epic-helper/reminders/ready/guild.reminder-ready';
import {guildService} from '../services/database/guild.service';

export default <CronJob>{
  name: 'guild-reminder',
  expression: '* * * * * *',
  execute: async (client) => {
    if (!redisService?.isReady) return;

    const guildReminders = await redisGuildReminder.getReadyGuild();
    if (!guildReminders.length) return;
    logger('guild reminder');
    guildReminders.forEach(({guildRoleId, serverId}) => {
      guildReminderTimesUp({guildRoleId, serverId, client});
      redisGuildReminder.deleteReminderTime({
        serverId,
        guildRoleId,
      });
    });
  },
};
