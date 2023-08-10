import {mongoClient} from '@epic-helper/services';
import {IUserDuelUser, userDuelSchema} from '@epic-helper/models';

const dbUserDuel = mongoClient.model('user-duel', userDuelSchema);

interface IAddLog {
  users: IUserDuelUser[];
  source?: {
    serverId: string;
    channelId: string;
    messageId: string;
  };
  duelAt?: Date;
}

const addLog = async ({duelAt, users, source}: IAddLog) => {
  const log = source && (await findLogBySource(source));
  if (log) {
    for (let user of users) {
      if (log.users.some((logUser) => logUser.userId === user.userId)) continue;
      log.users.push(user);
    }
    await log.save();
    return;
  }
  await dbUserDuel.create({
    source,
    duelAt: duelAt ?? new Date(),
    users,
  });
};

interface IFindLogBySource {
  serverId: string;
  channelId: string;
  messageId: string;
}

const findLogBySource = async ({serverId, channelId, messageId}: IFindLogBySource) => {
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
    },
    null,
    {
      sort: {
        duelAt: -1,
      },
    }
  );
  return log ?? null;
};

export const userDuelService = {
  addLog,
  findLogBySource,
  findLatestLog,
};
