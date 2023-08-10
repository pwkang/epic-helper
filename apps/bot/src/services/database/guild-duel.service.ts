import {mongoClient} from '@epic-helper/services';
import {guildDuelSchema} from '@epic-helper/models/dist/guild-duel/guild-duel.schema';
import {getGuildWeek} from '@epic-helper/utils';
import ms from 'ms';

const dbGuildDuel = mongoClient.model('guild-duel', guildDuelSchema);

interface IAddLog {
  userId: string;
  serverId: string;
  roleId: string;
  expGained: number;
}

const addLog = async ({expGained, roleId, userId, serverId}: IAddLog) => {
  const currentLog = await dbGuildDuel
    .findOne({
      serverId,
      guildRoleId: roleId,
      weekAt: getGuildWeek(),
    })
    .lean();
  let query = {};
  const arrayFilters: {[p: string]: any}[] = [];
  if (currentLog?.users.some((user) => user.userId === userId)) {
    query = {
      $inc: {
        'users.$[user].totalExp': expGained,
        'users.$[user].duelCount': 1,
      },
    };
    arrayFilters.push({
      'user.userId': userId,
    });
  } else {
    query = {
      $push: {
        users: {
          userId,
          totalExp: expGained,
          duelCount: 1,
        },
      },
    };
  }
  const updatedDuel = await dbGuildDuel.findOneAndUpdate(
    {
      guildRoleId: roleId,
      serverId,
      weekAt: getGuildWeek(),
    },
    query,
    {
      upsert: true,
      arrayFilters,
      new: true,
    }
  );
  return updatedDuel ?? null;
};

interface IGetLastTwoWeeksGuildsDuelLogs {
  serverId: string;
}

const getLastTwoWeeksGuildsDuelLogs = async ({serverId}: IGetLastTwoWeeksGuildsDuelLogs) => {
  const guildsDuelLogs = await dbGuildDuel
    .find({
      serverId,
      weekAt: {
        $gte: getGuildWeek().getTime() - ms('7d'),
      },
    })
    .lean();
  return guildsDuelLogs ?? [];
};

export const guildDuelService = {
  addLog,
  getLastTwoWeeksGuildsDuelLogs,
};
