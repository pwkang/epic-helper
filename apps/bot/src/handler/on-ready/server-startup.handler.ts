import type {Client} from 'discord.js';
import {redisServerInfo, serverService} from '@epic-helper/services';
import {EPIC_RPG_SERVER_INFO} from '@epic-helper/constants';

const loadServerOnReady = async (client: Client) => {
  await registerNewServers(client);
};

const registerNewServers = async (client: Client) => {
  const cachedServers = client.guilds.cache;
  const registeredServersId = await serverService.listRegisteredServersId();

  const serversToRegister = cachedServers.filter(
    (server) => !registeredServersId.includes(server.id),
  );
  serversToRegister.forEach((server) => {
    serverService.registerServer({
      serverId: server.id,
      name: server.name,
    });
  });

  cachedServers.forEach((server) => {
    redisServerInfo.setServerName({
      serverId: server.id,
      name: server.name,
    });
  });
  redisServerInfo.setServerName({
    serverId: EPIC_RPG_SERVER_INFO.id,
    name: EPIC_RPG_SERVER_INFO.name,
  });
};

export default loadServerOnReady;
