import {mongoClient} from '@epic-helper/services';
import {guildSchema, type IGuild} from '@epic-helper/models';
import {UpdateQuery} from 'mongoose';
import {redisGuildReminder} from '../redis/guild-reminder.redis';
import {Client} from 'discord.js';
import {toGuild, toGuilds} from '../transformer/guild.transformer';
import {redisGuildMembers} from '../redis/guild-members.redis';
import {redisGuild} from '../redis/guild.redis';
import mongooseLeanDefaults from 'mongoose-lean-defaults';

guildSchema.post('findOneAndUpdate', async (doc: IGuild) => {
  if (!doc) return;
  await redisGuild.setGuild(doc.serverId, doc.roleId, doc);
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

guildSchema.plugin(mongooseLeanDefaults);

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

interface IFindGuild {
  serverId: string;
  roleId: string;
}

const findGuild = async ({serverId, roleId}: IFindGuild) => {
  const cachedGuild = await redisGuild.getGuild(serverId, roleId);
  if (cachedGuild) return cachedGuild;
  const guild = await dbGuild.findOne({serverId, roleId}).lean();

  if (!guild) return null;
  return await redisGuild.setGuild(serverId, roleId, guild);
};

interface IIsRoleUsed {
  serverId: string;
  roleId: string;
}

const isRoleUsed = async ({serverId, roleId}: IIsRoleUsed): Promise<boolean> => {
  const guild = await findGuild({serverId, roleId});
  return !!guild;
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
  const guilds = await dbGuild.find({serverId}).lean();
  return toGuilds(guilds);
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

  await dbGuild.findOneAndUpdate({serverId, roleId}, updateQuery, {
    new: true,
  });
  return findGuild({serverId, roleId});
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
  await dbGuild.findOneAndUpdate({serverId, roleId}, {$set: {leaderId}}, {new: true});
  return findGuild({serverId, roleId});
};

interface IGetAllGuildRoles {
  serverId: string;
}

const getAllGuildRoles = async ({serverId}: IGetAllGuildRoles) => {
  const guild = await dbGuild.find({serverId}).select('roleId').lean();
  return guild.map((guild) => guild.roleId);
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

  await dbGuild.findOneAndUpdate({serverId, roleId}, query, {new: true});
  return findGuild({serverId, roleId});
};

interface IUpdateGuildInfo {
  serverId: string;
  roleId: string;
  name?: string;
  stealth?: number;
  level?: number;
  energy?: number;
}

const updateGuildInfo = async ({
  serverId,
  name,
  stealth,
  level,
  energy,
  roleId,
}: IUpdateGuildInfo) => {
  const query: UpdateQuery<IGuild> = {
    $set: {},
  };
  if (name !== undefined) query.$set!['info.name'] = name;
  if (stealth !== undefined) query.$set!['info.stealth'] = stealth;
  if (level !== undefined) query.$set!['info.level'] = level;
  if (energy !== undefined) query.$set!['info.energy'] = energy;
  if (Object.keys(query.$set!).length === 0) return Promise.resolve(null);
  await dbGuild.findOneAndUpdate({serverId, roleId}, query, {new: true});
  return findGuild({serverId, roleId});
};

interface IWeeklyReset {
  client: Client;
}

const weeklyReset = async ({client}: IWeeklyReset) => {
  await dbGuild.updateMany(
    {
      serverId: {$in: client.guilds.cache.map((guild) => guild.id)},
    },
    {
      $unset: {'upgraid.readyAt': 1},
      $set: {
        'info.stealth': 0,
      },
    }
  );
};

interface IUpdateToggle {
  serverId: string;
  roleId: string;
  query: UpdateQuery<IGuild>;
}

const updateToggle = async ({serverId, roleId, query}: IUpdateToggle): Promise<IGuild | null> => {
  await dbGuild.findOneAndUpdate(
    {
      serverId,
      roleId,
    },
    query,
    {
      new: true,
    }
  );
  return findGuild({serverId, roleId});
};

interface IResetToggle {
  serverId: string;
  roleId: string;
}

const resetToggle = async ({serverId, roleId}: IResetToggle): Promise<IGuild | null> => {
  await dbGuild.findOneAndUpdate(
    {serverId, roleId},
    {
      $unset: {
        toggle: '',
      },
    },
    {
      new: true,
    }
  );
  return findGuild({serverId, roleId});
};

interface IRegisterToGuild {
  serverId: string;
  roleId: string;
  userId: string;
}

const registerUserToGuild = async ({serverId, roleId, userId}: IRegisterToGuild) => {
  await dbGuild.findOneAndUpdate({serverId, roleId}, {$addToSet: {membersId: userId}}, {new: true});
  await dbGuild.findOneAndUpdate(
    {
      $or: [{serverId: {$ne: serverId}}, {roleId: {$ne: roleId}}],
      membersId: {$in: [userId]},
    },
    {$pull: {membersId: userId}},
    {new: true}
  );

  await redisGuildMembers.setGuildMember({
    guildRoleId: roleId,
    serverId,
    userId,
  });
};

interface IRemoveFromGuild {
  serverId: string;
  roleId: string;
  userId: string;
}

const removeUserFromGuild = async ({serverId, roleId, userId}: IRemoveFromGuild) => {
  await dbGuild.findOneAndUpdate({serverId, roleId}, {$pull: {membersId: userId}}, {new: true});

  await redisGuildMembers.removeGuildInfo({
    userId,
  });
};

interface IUpdateDuelLog {
  serverId: string;
  roleId: string;
  channelId?: string;
}

const updateDuelLog = async ({serverId, roleId, channelId}: IUpdateDuelLog) => {
  const query: UpdateQuery<IGuild> = {
    $set: {},
  };
  if (channelId) query.$set!['duel.channelId'] = channelId;
  await dbGuild.findOneAndUpdate({serverId, roleId}, query, {new: true});
  return findGuild({serverId, roleId});
};

interface IFindUserGuild {
  userId: string;
}

const findUserGuild = async ({userId}: IFindUserGuild) => {
  const cachedGuild = await redisGuildMembers.getGuildInfo({
    userId,
  });
  if (!cachedGuild) {
    const guild = await dbGuild.findOne({membersId: userId}).lean();
    if (!guild) return null;

    await redisGuildMembers.setGuildMember({
      guildRoleId: guild.roleId,
      serverId: guild.serverId,
      userId,
    });
    return toGuild(guild);
  }
  return findGuild({
    serverId: cachedGuild.serverId,
    roleId: cachedGuild.guildRoleId,
  });
};

export const guildService = {
  registerGuild,
  isRoleUsed,
  findGuild,
  updateGuildReminder,
  calcTotalGuild,
  getAllGuilds,
  deleteGuild,
  updateLeader,
  getAllGuildRoles,
  registerReminder,
  updateGuildInfo,
  weeklyReset,
  updateToggle,
  resetToggle,
  registerUserToGuild,
  removeUserFromGuild,
  updateDuelLog,
  findUserGuild,
};
