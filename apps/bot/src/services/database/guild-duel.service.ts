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

interface IModifyUserDuel {
  userId: string;
  serverId: string;
  roleId: string;
  expGained: number;
  duelCount: number;
}

const modifyUserDuel = async ({
  userId,
  serverId,
  roleId,
  expGained,
  duelCount,
}: IModifyUserDuel) => {
  const currentLog = await dbGuildDuel.findOne({
    serverId,
    guildRoleId: roleId,
    weekAt: getGuildWeek(),
  });
  const isUserExists = currentLog?.users.some((user) => user.userId === userId);
  let query = {};
  const arrayFilters: {[p: string]: any}[] = [];
  if (isUserExists) {
    query = {
      $set: {
        'users.$[user].totalExp': expGained,
        'users.$[user].duelCount': duelCount,
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
          duelCount,
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
    }
  );
  return updatedDuel ?? null;
};

interface IResetGuildDuel {
  serverId: string;
  roleId: string;
}

const resetGuildDuel = async ({serverId, roleId}: IResetGuildDuel) => {
  const currentLog = await dbGuildDuel.findOne({
    serverId,
    guildRoleId: roleId,
    weekAt: getGuildWeek(),
  });
  if (!currentLog) return null;
  const updatedDuel = await dbGuildDuel.findOneAndUpdate(
    {
      guildRoleId: roleId,
      serverId,
      weekAt: getGuildWeek(),
    },
    {
      $set: {
        users: [],
      },
    },
    {
      upsert: true,
      new: true,
    }
  );
  return updatedDuel ?? null;
};

export const guildDuelService = {
  addLog,
  getLastTwoWeeksGuildsDuelLogs,
  modifyUserDuel,
  resetGuildDuel,
};
