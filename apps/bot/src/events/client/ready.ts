import {Events} from 'discord.js';
import loadServerOnReady from '../../handler/on-ready/server-startup.handler';
import {logger} from '@epic-helper/utils';
import {redisCluster} from '../../services/redis/cluster.redis';
import commandHelper from '../../lib/epic-helper/command-helper';

export default <BotEvent>{
  eventName: Events.ClientReady,
  once: true,
  execute: async (client) => {
    logger({
      message: `Logged in as ${client.user?.tag}!`,
      clusterId: client.cluster?.id,
    });

    await commandHelper.cluster.setClusterInfo(client);

    loadServerOnReady(client);
  },
};
