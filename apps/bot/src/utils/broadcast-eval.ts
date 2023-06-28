import {Client} from 'discord.js';
import {evalOptions, getInfo} from 'discord-hybrid-sharding';
import {logger} from '@epic-helper/utils';

interface IBroadcastEval<T> {
  client: Client;
  fn: (client: Client) => T;
  target?: evalOptions['cluster'];
}

interface IBroadcastEvalResult<T> {
  clusterId: number;
  data: T | null;
}

export const broadcastEval = async <T>({
  fn,
  client,
  target,
}: IBroadcastEval<T>): Promise<IBroadcastEvalResult<T>[] | null> => {
  if (!client.cluster) {
    const result = fn(client);
    return [
      {
        data: result,
        clusterId: 0,
      },
    ];
  }
  const results: IBroadcastEvalResult<T>[] = [];

  for (let i = 0; i < getInfo().TOTAL_SHARDS; i++) {
    try {
      const result = (await client.cluster.broadcastEval(fn, {
        cluster: i,
      })) as T[];

      results.push({
        data: result[0],
        clusterId: i,
      });
    } catch (err) {
      results.push({
        data: null,
        clusterId: i,
      });
    }
  }
  return results;
};
