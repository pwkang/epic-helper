import type {Client} from 'discord.js';
import type {evalOptions} from 'discord-hybrid-sharding';
import {getInfo} from 'discord-hybrid-sharding';
import {logger} from '@epic-helper/utils';

interface IBroadcastEval<T, K> {
  client: Client;
  fn: (client: Client, context: K) => T;
  target?: evalOptions['cluster'];
  context?: K;
}

interface IBroadcastEvalResult<T> {
  clusterId: number;
  data: T | null;
}

export const broadcastEval = async <T, K>({
  fn,
  client,
  context
}: IBroadcastEval<T, K>): Promise<IBroadcastEvalResult<T>[] | null> => {
  if (!context) context = {} as K;
  if (!client.cluster) {
    const result = fn(client, context);
    return [
      {
        data: result,
        clusterId: 0
      }
    ];
  }
  const results: IBroadcastEvalResult<T>[] = [];

  for (let i = 0; i < getInfo().CLUSTER_COUNT; i++) {
    try {
      const result = (await client.cluster.broadcastEval(fn as any, {
        cluster: i,
        context
      })) as T[];

      results.push({
        data: result[0],
        clusterId: i
      });
    } catch (err) {
      logger({
        message: 'broadcastEval error' + err,
        clusterId: i,
        variant: 'broadcastEval',
        logLevel: 'error'
      });
      results.push({
        data: null,
        clusterId: i
      });
    }
  }
  return results;
};
