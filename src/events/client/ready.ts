import {Events} from 'discord.js';

export default <BotEvent>{
  eventName: Events.ClientReady,
  once: true,
  execute: async (client) => {
    console.log(`Logged in as ${client.user?.tag}!`);
  },
};
