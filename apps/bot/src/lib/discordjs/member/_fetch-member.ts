import {Client} from 'discord.js';
import {djsServerHelper} from '../server';

interface IFetchMember {
  client: Client;
  serverId: string;
  userId: string;
}

export const _fetchMember = async ({serverId, userId, client}: IFetchMember) => {
  const server = await djsServerHelper.getServer({serverId, client});
  if (!server) return;
  let member = server.members.cache.get(userId);
  if (!member) {
    member = await server.members.fetch(userId);
  }
  return member;
};
