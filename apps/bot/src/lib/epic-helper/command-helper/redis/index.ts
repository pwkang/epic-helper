import {_deleteRedisValues} from './del-redis-values';
import {_getRedisValues} from './get-redis-value';

export const _redisHelper = {
  deleteValues: _deleteRedisValues,
  getValue: _getRedisValues,
};
