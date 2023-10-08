import type {FilterQuery, QueryOptions} from 'mongoose';
import {mongoClient} from '@epic-helper/services';
import {getStartOfLastWeek, getStartOfToday} from '@epic-helper/utils';
import type {
  IUserStats,
  USER_STATS_RPG_COMMAND_TYPE
} from '@epic-helper/models';
import {userStatsSchema} from '@epic-helper/models';

const dbUserStats = mongoClient.model<IUserStats>(
  'user-stats',
  userStatsSchema
);

interface ICountUserStats {
  userId: string;
  type: ValuesOf<typeof USER_STATS_RPG_COMMAND_TYPE>;
}

const countUserStats = async ({userId, type}: ICountUserStats) => {
  await dbUserStats.findOneAndUpdate(
    {
      userId,
      statsAt: getStartOfToday()
    },
    {
      $inc: {
        [`rpg.${type}`]: 1
      }
    },
    {
      upsert: true
    }
  );
};

interface IGetUserStats {
  userId: string;
  limit: number;
  page: number;
}

const getUserStats = ({userId, limit, page}: IGetUserStats) => {
  const query: FilterQuery<IUserStats> = {
    userId
  };

  const options: QueryOptions = {};

  if (limit && page) {
    options.limit = limit;
    options.skip = limit * (page - 1);
  }

  return dbUserStats.find(query, null, options).sort({statsAt: -1});
};

interface IGetUserStatsOfLast2Weeks {
  userId: string;
}

const getUserStatsOfLast2Weeks = ({userId}: IGetUserStatsOfLast2Weeks) => {
  return dbUserStats.find({
    userId,
    statsAt: {
      $gte: getStartOfLastWeek()
    }
  });
};

interface IGetUserBestStats {
  userId: string;
}

const getUserBestStats = async ({
  userId
}: IGetUserBestStats): Promise<IUserStats['rpg'] | undefined> => {
  const stats = await dbUserStats.aggregate([
    {
      $match: {
        userId
      }
    },
    {
      $project: {
        uID: 1,
        'rpg.hunt': {$max: '$rpg.hunt'},
        'rpg.huntTogether': {$max: '$rpg.huntTogether'},
        'rpg.adventure': {$max: '$rpg.adventure'},
        'rpg.training': {$max: '$rpg.training'},
        'rpg.ultraining': {$max: '$rpg.ultraining'},
        'rpg.working': {$max: '$rpg.working'},
        'rpg.farm': {$max: '$rpg.farm'}
      }
    },
    {
      $group: {
        _id: '$userId',
        hunt: {$max: '$rpg.hunt'},
        huntTogether: {$max: '$rpg.huntTogether'},
        adventure: {$max: '$rpg.adventure'},
        ultraining: {$max: '$rpg.ultraining'},
        working: {$max: '$rpg.working'},
        farm: {$max: '$rpg.farm'}
      }
    }
  ]);
  return stats[0];
};

interface IClearUserStats {
  userId: string;
}

const clearUserStats = async ({userId}: IClearUserStats) => {
  await dbUserStats.deleteMany({
    userId
  });
};

export const userStatsService = {
  countUserStats,
  getUserStats,
  getUserStatsOfLast2Weeks,
  getUserBestStats,
  clearUserStats
};
