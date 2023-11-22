import type {Client} from 'discord.js';
import {djsServerHelper} from '../server';

interface IClearCachedMembers {
  client: Client;
  serverId: string;
}

export const _clearCachedMembers = async ({client, serverId}: IClearCachedMembers) => {
  const server = await djsServerHelper.getServer({serverId, client});
  if (!server) return;

  server.members.cache.clear();
  client.fetchedMemberGuilds.delete(serverId);
};
