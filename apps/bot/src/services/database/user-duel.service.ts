import {mongoClient} from '@epic-helper/services';
import type {IUserDuelUser} from '@epic-helper/models';
import {userDuelSchema} from '@epic-helper/models';
import {getGuildWeek} from '@epic-helper/utils';

const dbUserDuel = mongoClient.model('user-duel', userDuelSchema);

interface IAddLog {
  user: IUserDuelUser;
  source?: {
    serverId: string;
    channelId: string;
    messageId: string;
  };
  duelAt?: Date;
}

const addLog = async ({duelAt, user, source}: IAddLog) => {
  const log = !!source && (await findLogBySource(source));
  if (!log) {
    await dbUserDuel.create({
      source,
      duelAt: duelAt ?? new Date(),
      users: [user],
    });
    return {
      isExists: false,
      expGained: user.guildExp,
    };
  }
  if (!log.users.some((logUser) => logUser.userId === user.userId)) {
    log.users.push(user);
    await log.save();
    return {
      isExists: false,
      expGained: user.guildExp,
    };
  }
  const prevRecord =
    log.users.find((logUser) => logUser.userId === user.userId)?.guildExp ?? 0;
  const expGained = user.guildExp - prevRecord;
  log.users = log.users.map((logUser) => {
    if (logUser.userId === user.userId) {
      logUser.guildExp = user.guildExp;
    }
    return logUser;
  });
  await log.save();
  return {
    isExists: true,
    expGained,
  };
};

interface IFindLogBySource {
  serverId: string;
  channelId: string;
  messageId: string;
}

const findLogBySource = async ({
  serverId,
  channelId,
  messageId,
}: IFindLogBySource) => {
  const log = await dbUserDuel.findOne({
    'source.serverId': serverId,
    'source.channelId': channelId,
    'source.messageId': messageId,
  });
  return log ?? null;
};

interface IFindLatestLog {
  userId: string;
}

const findLatestLog = async ({userId}: IFindLatestLog) => {
  const log = await dbUserDuel.findOne(
    {
      'users.userId': userId,
      duelAt: {
        $gte: getGuildWeek(),
      },
    },
    null,
    {
      sort: {
        duelAt: -1,
      },
    },
  );
  return log ?? null;
};

interface IUndoDuelRecord {
  userId: string;
}

const undoDuelRecord = async ({userId}: IUndoDuelRecord) => {
  const log = await findLatestLog({userId});
  if (!log) return null;
  const user = log.users.find((u) => u.userId === userId);
  if (!user) return null;
  const expGained = user.guildExp;
  log.users = log.users.filter((u) => u.userId !== userId);
  await log.save();
  return {
    expRemoved: expGained,
    reportGuild: user.reportGuild,
  };
};

export const userDuelService = {
  addLog,
  findLogBySource,
  findLatestLog,
  undoDuelRecord,
};
