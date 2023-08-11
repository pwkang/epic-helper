import {redisService} from '../services/redis/redis.service';
import {redisGuildReminder} from '../services/redis/guild-reminder.redis';
import {guildReminderTimesUp} from '../lib/epic-helper/reminders/ready/guild.reminder-ready';
import {guildService} from '../services/database/guild.service';

export default <CronJob>{
  name: 'guildWeeklyReset',
  expression: '0 6 * * 7',
  execute: async (client) => {
    if (!redisService?.isReady) return;

    const guildReminders = await redisGuildReminder.getAllGuildReminder();
    if (!guildReminders.length) return;
    await guildService.weeklyReset({client});
    guildReminders.forEach(({guildRoleId, serverId}) => {
      if (!client.guilds.cache.has(serverId)) return;
      guildReminderTimesUp({guildRoleId, serverId, client});
      redisGuildReminder.deleteReminderTime({
        serverId,
        guildRoleId,
      });
    });
  },
};
