import {mongoClient} from '@epic-helper/services';
import {duelLogSchema} from '@epic-helper/models';

const dbDuelLog = mongoClient.model('duelLogs', duelLogSchema);

interface IAddLog {
  usersId: string[];
  winnerId: string;
  expGained: number;
  serverId?: string;
  channelId?: string;
  messageId?: string;
  duelAt?: Date;
}

const addLog = async ({
  duelAt,
  expGained,
  usersId,
  winnerId,
  serverId,
  messageId,
  channelId,
}: IAddLog) => {
  await dbDuelLog.create({
    usersId,
    winnerId,
    serverId,
    channelId,
    expGained,
    messageId,
    duelAt: duelAt ?? new Date(),
  });
};

export const duelLogService = {
  addLog,
};
