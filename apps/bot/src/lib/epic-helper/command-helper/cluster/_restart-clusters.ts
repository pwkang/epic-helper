import type {Client} from 'discord.js';

export const _restartClusters = async (client: Client, clustersId: number[]) => {
  await client.cluster?.send({
    action: 'restart',
    clustersId,
  });

};
