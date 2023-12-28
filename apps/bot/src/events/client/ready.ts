import {Events} from 'discord.js';
import loadServerOnReady from '../../handler/on-ready/server-startup.handler';
import {logger} from '@epic-helper/utils';
import commandHelper from '../../lib/epic-helper/command-helper';
import loadMainUserOnReady from '../../handler/on-ready/reminder-startup.handler';

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
    loadMainUserOnReady(client);
  },
};
