import {Events, Guild} from 'discord.js';
import serverService from '../../models/server/server.service';

export default <BotEvent>{
  eventName: Events.GuildCreate,
  once: false,
  execute: async (client, guild: Guild) => {
    console.log(`Joined ${guild.name}!`);
    const serverInfo = await serverService.findServerById(guild.id);
    if (!serverInfo) {
      serverService.registerServer({
        serverId: guild.id,
        name: guild.name,
      });
    }
  },
};
