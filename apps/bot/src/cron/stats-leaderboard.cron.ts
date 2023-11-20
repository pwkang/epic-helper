import commandHelper from '../lib/epic-helper/command-helper';

const channelId = process.env.STATS_LEADERBOARD_CHANNEL;

export default <CronJob>{
  name: 'stats-leaderboard',
  expression: '5 0 8 * * *',
  cronOptions: {
    runOnInit: true,
  },
  execute: async (client) => {
    if (!channelId || !client.channels.cache.has(channelId)) return;

    const isClusterActive = await commandHelper.cluster.isClusterActive(client);
    if (!isClusterActive) return;

    commandHelper.leaderboard.stats({client, channelId});
  },
};
