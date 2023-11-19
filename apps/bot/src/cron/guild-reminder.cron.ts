import {redisService} from '../services/redis/redis.service';
import {redisGuildReminder} from '../services/redis/guild-reminder.redis';
import {guildReminderTimesUp} from '../lib/epic-helper/reminders/ready/guild.reminder-ready';

export default <CronJob>{
  name: 'guild-reminder',
  expression: '* * * * * *',
  execute: async (client) => {
    if (!redisService?.isReady) return;

    const guildReminders = await redisGuildReminder.getReadyGuild();
    if (!guildReminders.length) return;
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
