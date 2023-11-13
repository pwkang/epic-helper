import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import commandHelper from '../../lib/epic-helper/command-helper';

const channelId = process.env.STATS_LEADERBOARD_CHANNEL;

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client) => {
    if (!channelId || !client.channels.cache.has(channelId)) return;
    commandHelper.leaderboard.stats({client, channelId});
  },
};
