import type {Guild} from 'discord.js';
import {Events} from 'discord.js';
import commandHelper from '../../lib/epic-helper/command-helper';
import {redisServerInfo, serverService} from '@epic-helper/services';

export default <BotEvent>{
  eventName: Events.GuildCreate,
  once: false,
  execute: async (client, guild: Guild) => {

    const isClusterActive = await commandHelper.cluster.isClusterActive(client);
    if (!isClusterActive) return;

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
