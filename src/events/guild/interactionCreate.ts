import {Events} from 'discord.js';

export default <BotEvent>{
  eventName: Events.InteractionCreate,
  once: false,
  execute: async () => {},
};
