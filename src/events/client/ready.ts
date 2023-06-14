import {Events} from 'discord.js';
import loadServerOnReady from '../../handler/on-ready/server-startup.handler';

export default <BotEvent>{
  eventName: Events.ClientReady,
  once: true,
  execute: async (client) => {
    console.log(`Logged in as ${client.user?.tag}!`);

    loadServerOnReady(client);
  },
};
