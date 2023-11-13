import commandHelper from '../lib/epic-helper/command-helper';

const channelId = process.env.STATS_LEADERBOARD_CHANNEL;

export default <CronJob>{
  name: 'stats-leaderboard',
  expression: '0 0 0 * * *',
  cronOptions: {
    runOnInit: true,
  },
  execute: async (client) => {
    if (!channelId || !client.channels.cache.has(channelId)) return;
    commandHelper.leaderboard.stats({client, channelId});
  },
};
