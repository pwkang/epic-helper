import {redisService} from '../services/redis/redis.service';
import {redisGuildReminder} from '../services/redis/guild-reminder.redis';
import {logger} from '@epic-helper/utils';
import {guildReminderTimesUp} from '../lib/epic-helper/reminders/ready/guild.reminder-ready';
import {guildService} from '../services/database/guild.service';

export default <CronJob>{
  name: 'guildWeeklyReset',
  expression: '0 22 * * 6',
  execute: async (client) => {
    if (!redisService?.isReady) return;

    const guildReminders = await redisGuildReminder.getAllGuildReminder();
    if (!guildReminders.length) return;
    logger('guild reset');
    await guildService.weeklyReset({client});
    guildReminders.forEach(({guildRoleId, readyAt, serverId}) => {
      if (!client.guilds.cache.has(serverId)) return;
      guildReminderTimesUp({guildRoleId, serverId, client});
      redisGuildReminder.deleteReminderTime({
        serverId,
        guildRoleId,
      });
    });
  },
};
