import {Events, Message} from 'discord.js';

export default <BotEvent>{
  eventName: Events.MessageCreate,
  once: false,
  execute: async (client, message: Message) => {
    console.log(message.content);
  },
};
