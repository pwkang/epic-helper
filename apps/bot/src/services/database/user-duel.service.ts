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
  await dbUserDuel.create({
    source,
    duelAt: duelAt ?? new Date(),
    users,
  });
};

export const userDuelService = {
  addLog,
};
