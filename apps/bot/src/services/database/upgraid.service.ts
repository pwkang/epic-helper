import {mongoClient} from '@epic-helper/services';
import {upgraidSchema} from '@epic-helper/models';
import {getGuildWeek} from '@epic-helper/utils';

const dbUpgraid = mongoClient.model('upgraids', upgraidSchema);

interface IAddRecord {
  serverId: string;
  guildRoleId: string;
  userId: string;
  commandType: 'upgrade' | 'raid';
  upgraidAt: Date;
  actionServerId: string;
  actionChannelId: string;
  actionMessageId: string;
}

const addRecord = async ({
  serverId,
  guildRoleId,
  actionChannelId,
  actionServerId,
  actionMessageId,
  userId,
  commandType,
  upgraidAt
}: IAddRecord) => {
  const existingRecord = await dbUpgraid.findOne({
    serverId,
    roleId: guildRoleId,
    weekAt: getGuildWeek()
  });
  let query = {};
  const arrayFilters: {[p: string]: any}[] = [];
  if (existingRecord?.users.some((user) => user.uId === userId)) {
    query = {
      $push: {
        'users.$[user].records': {
          commandType,
          upgraidAt,
          serverId: actionServerId,
          channelID: actionChannelId,
          messageID: actionMessageId
        }
      }
    };
    arrayFilters.push({
      'user.uId': userId
    });
  } else {
    query = {
      $push: {
        users: {
          uId: userId,
          records: [
            {
              commandType,
              upgraidAt,
              serverId: actionServerId,
              channelID: actionChannelId,
              messageID: actionMessageId
            }
          ]
        }
      }
    };
  }

  await dbUpgraid.findOneAndUpdate(
    {
      serverId,
      roleId: guildRoleId,
      weekAt: getGuildWeek()
    },
    {
      $set: {
        serverId,
        roleId: guildRoleId,
        weekAt: getGuildWeek()
      },
      ...query
    },
    {
      upsert: true,
      arrayFilters
    }
  );
};

interface IFindCurrentUpgraid {
  serverId: string;
  guildRoleId: string;
}

const findCurrentUpgraid = async ({
  serverId,
  guildRoleId
}: IFindCurrentUpgraid) => {
  return dbUpgraid.findOne({
    serverId,
    roleId: guildRoleId,
    weekAt: getGuildWeek()
  });
};

export const upgraidService = {
  addRecord,
  findCurrentUpgraid
};
