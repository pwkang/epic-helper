import {redisService} from './redis.service';

const PREFIX = 'epic-helper:user-active-cluster:';

const getKey = (userId: string) => {
  return `${PREFIX}${userId}`;
};

interface IRedisUserActiveCluster {
  userId: string;
  clusterId?: number;
}

const get = async (userId: string): Promise<IRedisUserActiveCluster | null> => {
  const data = await redisService.get(getKey(userId));
  return data ? JSON.parse(data) : null;
};

const set = async (userId: string, clusterId: number = -1) => {
  await redisService.set(
    getKey(userId),
    JSON.stringify(toData({userId, clusterId})),
  );
};

const toData = (data: any) => {
  return {
    userId: data.userId,
    clusterId: data.clusterId,
  };
};

const getUsersId = async (clusterId: number = -1) => {
  const keys = await redisService.keys(`${PREFIX}*`);
  const usersId = await Promise.all(
    keys.map(async (key) => {
      const data = await redisService.get(key);
      if (!data) return '';
      const {userId, clusterId: userClusterId} = JSON.parse(
        data,
      ) as IRedisUserActiveCluster;
      if (userClusterId !== clusterId) return '';
      return userId;
    }),
  );
  return usersId.filter((id) => id !== '');
};

export const redisUserActiveCluster = {
  set,
  get,
  getUsersId,
};
