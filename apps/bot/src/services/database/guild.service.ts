import {mongoClient} from '@epic-helper/services';
import {guildSchema, type IGuild} from '@epic-helper/models';
import {UpdateQuery} from 'mongoose';
import {redisGuildReminder} from '../redis/guild-reminder.redis';

guildSchema.post('findOneAndUpdate', async (doc: IGuild) => {
  if (doc.upgraid.readyAt && doc.upgraid.readyAt > new Date()) {
    await redisGuildReminder.setReminderTime({
      serverId: doc.serverId,
      readyAt: doc.upgraid.readyAt,
      guildRoleId: doc.roleId,
    });
  } else {
    await redisGuildReminder.deleteReminderTime({
      serverId: doc.serverId,
      guildRoleId: doc.roleId,
    });
  }
});

const dbGuild = mongoClient.model('guilds', guildSchema);

interface IRegisterGuild {
  serverId: string;
  roleId: string;
  leaderId?: string;
}

const registerGuild = async ({serverId, roleId, leaderId}: IRegisterGuild): Promise<IGuild> => {
  return await dbGuild.create({
    serverId,
    roleId,
    leaderId,
  });
};

interface IIsRoleUsed {
  serverId: string;
  roleId: string;
}

const isRoleUsed = async ({serverId, roleId}: IIsRoleUsed): Promise<boolean> => {
  const guild = await dbGuild.findOne({serverId, roleId});
  return !!guild;
};

interface IFindGuild {
  serverId: string;
  roleId: string;
}

const findGuild = async ({serverId, roleId}: IFindGuild) => {
  return dbGuild.findOne({serverId, roleId});
};

interface IFindFirstGuild {
  serverId: string;
}

const findFirstGuild = async ({serverId}: IFindFirstGuild) => {
  return dbGuild.findOne({serverId});
};

interface IUpdateGuildReminder {
  serverId: string;
  roleId: string;
  channelId?: string;
  targetStealth?: number;
  upgradeMessage?: string;
  raidMessage?: string;
}

interface IGetAllGuilds {
  serverId: string;
}

const getAllGuilds = async ({serverId}: IGetAllGuilds) => {
  return dbGuild.find({serverId});
};

const updateGuildReminder = async ({
  serverId,
  roleId,
  channelId,
  targetStealth,
  upgradeMessage,
  raidMessage,
}: IUpdateGuildReminder): Promise<IGuild | null> => {
  const updateQuery: UpdateQuery<IGuild> = {
    $set: {},
  };

  if (channelId) {
    updateQuery.$set!['upgraid.channelId'] = channelId;
  }

  if (targetStealth !== undefined) {
    updateQuery.$set!['upgraid.targetStealth'] = targetStealth;
  }

  if (upgradeMessage) {
    updateQuery.$set!['upgraid.message.upgrade'] = upgradeMessage;
  }

  if (raidMessage) {
    updateQuery.$set!['upgraid.message.raid'] = raidMessage;
  }

  return dbGuild.findOneAndUpdate({serverId, roleId}, updateQuery, {
    new: true,
  });
};

interface ICalcTotalGuild {
  serverId: string;
}

const calcTotalGuild = async ({serverId}: ICalcTotalGuild) => {
  return dbGuild.countDocuments({serverId});
};

interface IDeleteGuild {
  serverId: string;
  roleId: string;
}

const deleteGuild = async ({serverId, roleId}: IDeleteGuild) => {
  return dbGuild.findOneAndDelete({serverId, roleId});
};

interface IUpdateLeader {
  serverId: string;
  roleId: string;
  leaderId: string;
}

const updateLeader = async ({serverId, roleId, leaderId}: IUpdateLeader) => {
  return dbGuild.findOneAndUpdate({serverId, roleId}, {$set: {leaderId}}, {new: true});
};

interface IGetAllGuildRoles {
  serverId: string;
}

const getAllGuildRoles = async ({serverId}: IGetAllGuildRoles) => {
  return dbGuild.find({serverId}).select('roleId');
};

interface IRegisterReminder {
  serverId: string;
  roleId: string;
  readyIn: number;
}

const registerReminder = async ({serverId, roleId, readyIn}: IRegisterReminder) => {
  const query: UpdateQuery<IGuild> = {};
  if (readyIn) {
    query.$set = {
      'upgraid.readyAt': new Date(Date.now() + readyIn),
    };
  } else {
    query.$unset = {
      'upgraid.readyAt': 1,
    };
  }

  return dbGuild.findOneAndUpdate({serverId, roleId}, query, {new: true});
};

interface IUpdateGuildInfo {
  serverId: string;
  name?: string;
  stealth?: number;
  level?: number;
  energy?: number;
}

const updateGuildInfo = async ({serverId, name, stealth, level, energy}: IUpdateGuildInfo) => {
  const query: UpdateQuery<IGuild> = {
    $set: {},
  };
  if (name !== undefined) query.$set!['info.name'] = name;
  if (stealth !== undefined) query.$set!['info.stealth'] = stealth;
  if (level !== undefined) query.$set!['info.level'] = level;
  if (energy !== undefined) query.$set!['info.energy'] = energy;
  if (Object.keys(query.$set!).length === 0) return Promise.resolve(null);
  return dbGuild.findOneAndUpdate({serverId}, query, {new: true});
};

export const guildService = {
  registerGuild,
  isRoleUsed,
  findGuild,
  findFirstGuild,
  updateGuildReminder,
  calcTotalGuild,
  getAllGuilds,
  deleteGuild,
  updateLeader,
  getAllGuildRoles,
  registerReminder,
  updateGuildInfo,
};
