import type {Client} from 'discord.js';
import {getInfo} from 'discord-hybrid-sharding';
import {logger} from '@epic-helper/utils';

type IBroadcastEval<T, K> = {
  client: Client;
  target?: number[] | 'all';
} & (EvalFn<T, K> | EvalString);

type EvalFn<T, K> = {
  fn: (client: Client, context: K) => T;
  context?: K;
};

type EvalString = {
  fn: string;
  context?: never;
};

interface IBroadcastEvalResult<T> {
  clusterId: number;
  data: T | string;
}

export const broadcastEval = async <T, K>(
  props: IBroadcastEval<T, K>,
): Promise<IBroadcastEvalResult<T>[]> => {
  const {client, target} = props;

  if (!client.cluster || !target) return await evalOnly(props);
  if (target === 'all') return await broadcastAll(props);
  if (Array.isArray(target)) return await broadcastTargets(props);

  return [];
};

const broadcastTargets = async <T, K>({
  fn,
  client,
  target,
  context,
}: IBroadcastEval<T, K>): Promise<IBroadcastEvalResult<T>[]> => {
  if (!client.cluster || !target) return [];
  const results: IBroadcastEvalResult<T>[] = [];

  for (const clusterId of target) {
    if (typeof clusterId !== 'number') continue;
    if (clusterId < 0 || clusterId >= getInfo().CLUSTER_COUNT) continue;
    try {
      const result = (await client.cluster.broadcastEval(fn as any, {
        cluster: clusterId,
        context,
      })) as T[];

      results.push({
        data: result[0],
        clusterId,
      });
    } catch (err) {
      logger({
        message: 'broadcastEval error' + err,
        clusterId,
        variant: 'broadcastEvalTarget',
        logLevel: 'error',
      });
      results.push({
        data: String(err),
        clusterId,
      });
    }
  }
  return results;
};

const evalOnly = async <T, K>({
  fn,
  client,
  context,
}: IBroadcastEval<T, K>): Promise<IBroadcastEvalResult<T>[]> => {
  if (!context) context = {} as K;
  try {
    const result = typeof fn === 'string' ? eval(fn) : fn(client, context);
    return [
      {
        data: result,
        clusterId: client.cluster?.id ?? 0,
      },
    ];
  } catch (err) {
    logger({
      message: 'broadcastEval error' + err,
      clusterId: client.cluster?.id ?? 0,
      variant: 'broadcastEvalOnly',
      logLevel: 'error',
    });
    return [
      {
        data: String(err),
        clusterId: client.cluster?.id ?? 0,
      },
    ];
  }
};

const broadcastAll = async <T, K>({
  fn,
  client,
  context,
}: IBroadcastEval<T, K>): Promise<IBroadcastEvalResult<T>[]> => {
  if (!client.cluster) return [];
  const results: IBroadcastEvalResult<T>[] = [];

  for (let i = 0; i < getInfo().CLUSTER_COUNT; i++) {
    try {
      const result = (await client.cluster.broadcastEval(fn as any, {
        cluster: i,
        context,
      })) as T[];

      results.push({
        data: result[0],
        clusterId: i,
      });
    } catch (err) {
      logger({
        message: 'broadcastEval error' + err,
        clusterId: i,
        variant: 'broadcastEvalAll',
        logLevel: 'error',
      });
      results.push({
        data: String(err),
        clusterId: i,
      });
    }
  }
  return results;
};
