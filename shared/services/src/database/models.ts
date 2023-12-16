import {mongoClient} from '../clients/mongoose.service';
import type {IDonor, IGuild, IUser, IUserReminder, IUserStats} from '@epic-helper/models';
import {
  donorSchema,
  freeDonorSchema,
  guildDuelSchema,
  guildSchema,
  serverSchema,
  upgraidSchema,
  userDuelSchema,
  userReminderSchema,
  userSchema,
  userStatsSchema,
} from '@epic-helper/models';
import {redisGuild} from '../redis/guild.redis';
import {redisGuildReminder} from '../redis/guild-reminder.redis';
import mongooseLeanDefaults from 'mongoose-lean-defaults';
import {redisServerAccount} from '../redis/server-account.redis';
import userAccountRedis from '../redis/user-account.redis';

/*
 * Donor
 */
export const dbDonor = mongoClient.model<IDonor>('donors', donorSchema);


/*
 * Free Donor
 */
export const dbFreeDonor = mongoClient.model('freeDonors', freeDonorSchema);


/**
 * Guilds
 */

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

export const dbGuild = mongoClient.model('guilds', guildSchema);

/**
 * Guild Duel
 */

export const dbGuildDuel = mongoClient.model('guild-duel', guildDuelSchema);

/**
 * Servers
 */
serverSchema.post('findOneAndUpdate', async function(doc) {
  if (!doc) return;
  await redisServerAccount.setServer(doc.serverId, doc);
});

serverSchema.plugin(mongooseLeanDefaults);

export const dbServer = mongoClient.model('servers', serverSchema);

/**
 * Upgraid
 */
export const dbUpgraid = mongoClient.model('upgraids', upgraidSchema);

/**
 * Users
 */
userSchema.post('findOneAndUpdate', async function(doc) {
  if (!doc) return;
  await userAccountRedis.setUser(doc.userId, doc);
});

userSchema.plugin(mongooseLeanDefaults);

export const dbUser = mongoClient.model<IUser>('users', userSchema);

/**
 * User Duel
 */
export const dbUserDuel = mongoClient.model('user-duel', userDuelSchema);

/**
 * User Reminder
 */
export const dbUserReminder = mongoClient.model<IUserReminder>(
  'user-reminders',
  userReminderSchema,
);

/**
 * User Stats
 */
userStatsSchema.plugin(mongooseLeanDefaults);

export const dbUserStats = mongoClient.model<IUserStats>(
  'user-stats',
  userStatsSchema,
);
