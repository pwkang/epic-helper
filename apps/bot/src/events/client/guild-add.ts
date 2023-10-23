import type {Guild} from 'discord.js';
import {Events} from 'discord.js';
import {serverService} from '../../services/database/server.service';
import {redisServerInfo} from '../../services/redis/server-info.redis';

export default <BotEvent>{
  eventName: Events.GuildCreate,
  once: false,
  execute: async (client, guild: Guild) => {
    const serverInfo = await serverService.getServer({serverId: guild.id});
    if (!serverInfo) {
      serverService.registerServer({
        serverId: guild.id,
        name: guild.name,
      });
    }
    redisServerInfo.setServerName({
      serverId: guild.id,
      name: guild.name,
    });
  },
};
