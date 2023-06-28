import {Client} from 'discord.js';

interface IGetServer {
  client: Client;
  serverId: string;
}

export const _getServer = async ({serverId, client}: IGetServer) => {
  let server = client.guilds.cache.get(serverId);
  if (!server) {
    server = await client.guilds.fetch(serverId);
  }
  return server;
};
