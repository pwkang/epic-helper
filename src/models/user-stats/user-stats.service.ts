import {mongoClient} from '../../services/mongoose/mongoose.service';
import {IUserStats, USER_STATS_RPG_COMMAND_TYPE} from './user-stats.types';
import userStatsSchema from './user-stats.schema';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {FilterQuery, QueryOptions} from 'mongoose';
import {getStartOfToday} from '../../utils/datetime';

dayjs.extend(utc);

const dbUserStats = mongoClient.model<IUserStats>('user-stats', userStatsSchema);

interface ICountUserStats {
  userId: string;
  type: ValuesOf<typeof USER_STATS_RPG_COMMAND_TYPE>;
}

export const countUserStats = async ({userId, type}: ICountUserStats) => {
  await dbUserStats.findOneAndUpdate(
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
    }
  );
};

interface IGetUserStats {
  userId: string;
  limit: number;
  page: number;
}

export const getUserStats = ({userId, limit, page}: IGetUserStats) => {
  const query: FilterQuery<IUserStats> = {
    userId,
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

export const getUserStatsOfLast2Weeks = ({userId}: IGetUserStatsOfLast2Weeks) => {
  return dbUserStats.find({
    userId,
    statsAt: {
      $gte: dayjs.utc().startOf('week').subtract(2, 'week').add(1, 'day').toDate(),
    },
  });
};

interface IGetUserBestStats {
  userId: string;
}

export const getUserBestStats = async ({
  userId,
}: IGetUserBestStats): Promise<IUserStats['rpg'] | undefined> => {
  const stats = await dbUserStats.aggregate([
    {
      $match: {
        userId,
      },
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
        'rpg.farm': {$max: '$rpg.farm'},
      },
    },
    {
      $group: {
        _id: '$userId',
        hunt: {$max: '$rpg.hunt'},
        huntTogether: {$max: '$rpg.huntTogether'},
        adventure: {$max: '$rpg.adventure'},
        ultraining: {$max: '$rpg.ultraining'},
        working: {$max: '$rpg.working'},
        farm: {$max: '$rpg.farm'},
      },
    },
  ]);
  return stats[0];
};
