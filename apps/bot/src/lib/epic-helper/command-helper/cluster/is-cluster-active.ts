import type {Client} from 'discord.js';

export const _isClusterActive = async (client: Client) => {
  return !client.cluster || client.isReady();
};
