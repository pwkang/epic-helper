import {mongoClient} from '../../services/mongoose/mongoose.service';
import {IUserStats, USER_STATS_RPG_COMMAND_TYPE} from './user-stats.types';
import userStatsSchema from './user-stats.schema';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {FilterQuery, QueryOptions} from 'mongoose';

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
      statsAt: dayjs.utc().startOf('day').toDate(),
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
  limit?: number;
  page?: number;
  statsBefore?: Date;
}

export const getUserStats = ({userId, limit, page, statsBefore}: IGetUserStats) => {
  const query: FilterQuery<IUserStats> = {
    userId,
  };

  const options: QueryOptions = {};

  if (statsBefore) {
    query.statsAt = {
      $lte: statsBefore,
    };
  } else if (limit && page) {
    options.limit = limit;
    options.skip = limit * (page - 1);
  }

  return dbUserStats.find(query, null, options).sort({statsAt: -1});
};
