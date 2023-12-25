import {guildReminderTimesUp} from '../lib/epic-helper/reminders/ready/guild.reminder-ready';
import commandHelper from '../lib/epic-helper/command-helper';
import {guildService, redisGuildReminder, redisService} from '@epic-helper/services';

export default <CronJob>{
  name: 'guildWeeklyReset',
  expression: '0 6 * * 7',
  execute: async (client) => {
    if (!redisService?.isReady) return;

    const isClusterActive = await commandHelper.cluster.isClusterActive(client);
    if (!isClusterActive) return;

    const guildReminders = await redisGuildReminder.getAllGuildReminder(client);
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
