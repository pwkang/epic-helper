import {redisService} from './redis.service';
import type {Client} from 'discord.js';

const prefix = 'epic-helper:guild-reminder:';

interface IRedisGuildReminder {
  serverId: string;
  guildRoleId: string;
  readyAt: Date;
}

interface ISetReminderTime {
  serverId: string;
  guildRoleId: string;
  readyAt: Date;
}

const setReminderTime = async ({
  serverId,
  guildRoleId,
  readyAt,
}: ISetReminderTime) => {
  const data: IRedisGuildReminder = {
    readyAt,
    guildRoleId,
    serverId,
  };
  await redisService.set(
    `${prefix}${serverId}:${guildRoleId}`,
    JSON.stringify(data),
  );
};

const getReadyGuild = async (client: Client): Promise<
  Pick<ISetReminderTime, 'serverId' | 'guildRoleId'>[]
> => {
  let keys = await redisService.keys(`${prefix}*`);
  keys = keys.filter(key => client.guilds.cache.has(key.split(':')[2]));
  const reminderList = await Promise.all(
    keys.map(async (key) => {
      const data = await redisService.get(key);
      if (!data) return null;
      const {readyAt, guildRoleId, serverId} = JSON.parse(data) as Record<
        keyof IRedisGuildReminder,
        string
      >;
      if (new Date(readyAt) > new Date()) return null;
      return {
        guildRoleId,
        serverId,
      };
    }),
  );
  return reminderList.filter((item) => item !== null) as Pick<
    ISetReminderTime,
    'serverId' | 'guildRoleId'
  >[];
};

interface IDeleteReminderTime {
  serverId: string;
  guildRoleId: string;
}

const deleteReminderTime = async ({
  guildRoleId,
  serverId,
}: IDeleteReminderTime) => {
  await redisService.del(`${prefix}${serverId}:${guildRoleId}`);
};

const getAllGuildReminder = async (client: Client) => {
  let keys = await redisService.keys(`${prefix}*`);
  keys = keys.filter(key => client.guilds.cache.has(key.split(':')[2]));
  const reminderList = await Promise.all(
    keys.map(async (key) => {
      const data = await redisService.get(key);
      if (!data) return null;
      const {readyAt, guildRoleId, serverId} = JSON.parse(data) as Record<
        keyof IRedisGuildReminder,
        string
      >;
      return {
        guildRoleId,
        serverId,
        readyAt: new Date(readyAt),
      };
    }),
  );
  return reminderList.filter((item) => item !== null) as IRedisGuildReminder[];
};

export const redisGuildReminder = {
  setReminderTime,
  getReadyGuild,
  deleteReminderTime,
  getAllGuildReminder,
};
