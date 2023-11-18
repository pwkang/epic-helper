import type {FilterQuery, QueryOptions} from 'mongoose';
import {mongoClient} from '@epic-helper/services';
import {getStartOfLastWeek, getStartOfToday} from '@epic-helper/utils';
import type {IUserStats, USER_STATS_RPG_COMMAND_TYPE} from '@epic-helper/models';
import {userStatsSchema} from '@epic-helper/models';
import mongooseLeanDefaults from 'mongoose-lean-defaults';

userStatsSchema.plugin(mongooseLeanDefaults);

const dbUserStats = mongoClient.model<IUserStats>(
  'user-stats',
  userStatsSchema,
);

interface ICountUserStats {
  userId: string;
  type: ValuesOf<typeof USER_STATS_RPG_COMMAND_TYPE>;
}

const countUserStats = async ({userId, type}: ICountUserStats) => {
  const updatedStats = await dbUserStats.findOneAndUpdate(
    {
      userId,
      statsAt: getStartOfToday(),
    },
    {
      $inc: {
        [`rpg.${type}`]: 1,
      },
    },
    {
      upsert: true,
      new: true,
      lean: true,
    },
  );

  return updatedStats ?? null;
};

interface IGetUserStats {
  userId: string;
  limit: number;
  page: number;
}

const getUserStats = async ({userId, limit, page}: IGetUserStats) => {
  const query: FilterQuery<IUserStats> = {
    userId,
  };

  const options: QueryOptions = {};

  if (limit && page) {
    options.limit = limit;
    options.skip = limit * (page - 1);
  }

  const userStats = await dbUserStats
    .find(query, null, options)
    .sort({statsAt: -1})
    .lean({defaults: true});

  return userStats ?? null;
};

interface IGetUserStatsOfLast2Weeks {
  userId: string;
}

const getUserStatsOfLast2Weeks = async ({
  userId,
}: IGetUserStatsOfLast2Weeks) => {
  const userStats = await dbUserStats
    .find({
      userId,
      statsAt: {
        $gte: getStartOfLastWeek(),
      },
    })
    .lean({defaults: true});

  return userStats ?? null;
};

interface IClearUserStats {
  userId: string;
}

const clearUserStats = async ({userId}: IClearUserStats) => {
  await dbUserStats.deleteMany({
    userId,
  });
};

interface IGetBestStats {
  type: ValuesOf<typeof USER_STATS_RPG_COMMAND_TYPE>;
  limit: number;
  day: Date;
}

const getBestStats = async ({type, limit, day}: IGetBestStats) => {
  const userStats = await dbUserStats
    .find({
      statsAt: day,
    })
    .sort({[`rpg.${type}`]: -1})
    .limit(limit)
    .lean({defaults: true});

  return userStats ?? null;
};

export const userStatsService = {
  countUserStats,
  getUserStats,
  getUserStatsOfLast2Weeks,
  clearUserStats,
  getBestStats,
};
