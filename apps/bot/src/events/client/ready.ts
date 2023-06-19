import {Events} from 'discord.js';
import loadServerOnReady from '../../handler/on-ready/server-startup.handler';
import {logger} from '../../utils/logger';

export default <BotEvent>{
  eventName: Events.ClientReady,
  once: true,
  execute: async (client) => {
    logger({
      client,
      message: `Logged in as ${client.user?.tag}!`,
    });

    loadServerOnReady(client);
  },
};
