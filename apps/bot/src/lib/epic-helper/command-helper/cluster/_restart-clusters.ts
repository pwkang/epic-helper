import type {Client} from 'discord.js';
import {broadcastEval} from '../../../../utils/broadcast-eval';

export const _restartClusters = async (client: Client, clustersid: number[]) => {
  await broadcastEval({
    client,
    target: clustersid,
    fn: (client) => {
      client.cluster?.send({
        action: 'restart',
      });
    },
  });
};
