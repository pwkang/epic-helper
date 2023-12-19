import type {RPG_AREA, RPG_COMMAND_TYPE, RPG_DONOR_TIER, RPG_ENCHANT_LEVEL} from '@epic-helper/constants';
import redisUserAccount from '../redis/user-account.redis';
import type {IUser, IUserToggle, USER_STATS_RPG_COMMAND_TYPE} from '@epic-helper/models';
import type {ValuesOf} from '@epic-helper/types';
import {dbUser} from './models';
import type {UpdateQuery} from 'mongoose';


const saveUser = async (user: IUser) => {
  user.updatedAt = new Date();
  await redisUserAccount.setUser(user.userId, user);
};

const getUserAccount = async (userId: string): Promise<IUser | null> => {
  const cachedUser = await redisUserAccount.findUser(userId);
  if (cachedUser) return cachedUser;

  const user = await dbUser
    .findOne({
      userId,
    })
    .lean({defaults: true});

  if (user) await redisUserAccount.setUser(userId, user);

  return user ?? null;
};

const syncUser = async (userId: string) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  await dbUser.findOneAndUpdate(
    {
      userId,
    },
    user,
    {
      upsert: true,
    },
  );
};

interface RegisterUserProps {
  userId: string;
  username: string;
  channelId: string;
}

const registerUserAccount = async ({
  userId,
  username,
  channelId,
}: RegisterUserProps): Promise<boolean> => {
  const user = await getUserAccount(userId);

  if (!user) {
    const newUser = new dbUser({
      userId,
      username,
      channel: {
        all: channelId,
      },
    });

    await newUser.save();
    return true;
  }
  return false;
};

const userAccountOn = async (userId: string) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  user.config.onOff = true;
  await saveUser(user);
  return user;
};

const userAccountOff = async (userId: string) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  user.config.onOff = false;
  await saveUser(user);
  return user;
};

const userAccountDelete = async (userId: string) => {
  await dbUser.findOneAndDelete({
    userId,
  });
  await redisUserAccount.delUser(userId);
};

const isUserAccountExist = async (userId: string) => {
  const user = await getUserAccount(userId);
  return !!user;
};

interface IUpdateRpgDonorTier {
  userId: string;
  tier: ValuesOf<typeof RPG_DONOR_TIER>;
}

const updateRpgDonorTier = async ({
  userId,
  tier,
}: IUpdateRpgDonorTier) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  user.config.donor = tier;
  await saveUser(user);
  return user;
};

interface IUpdateRpgDonorPTier {
  userId: string;
  tier: ValuesOf<typeof RPG_DONOR_TIER> | null;
}

const updateRpgDonorPTier = async ({
  userId,
  tier,
}: IUpdateRpgDonorPTier) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  if (tier) {
    user.config.donorP = tier;
  } else {
    delete user.config.donorP;
  }
  await saveUser(user);
  return user;
};

const removeRpgDonorPTier = async (userId: string) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  delete user.config.donorP;
  await saveUser(user);
  return user;
};


interface IUpdateUserRubyAmount {
  userId: string;
  ruby: number;
  type: 'set' | 'inc' | 'dec';
}

const updateUserRubyAmount = async ({
  ruby,
  userId,
  type,
}: IUpdateUserRubyAmount) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  switch (type) {
    case 'set':
      user.items.ruby = ruby;
      break;
    case 'inc':
      user.items.ruby += ruby;
      break;
    case 'dec':
      user.items.ruby -= ruby;
      break;
  }
  await saveUser(user);
  return user;
};

const getUserRubyAmount = async (userId: string): Promise<number> => {
  const user = await getUserAccount(userId);
  return user?.items.ruby ?? 0;
};

interface ISetUserEnchantTier {
  userId: string;
  tier: ValuesOf<typeof RPG_ENCHANT_LEVEL>;
}

const setUserEnchantTier = async ({
  userId,
  tier,
}: ISetUserEnchantTier) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  user.config.enchant = tier;
  await saveUser(user);
  return user;
};

interface IRemoveUserEnchantTier {
  userId: string;
}

const removeUserEnchantTier = async ({
  userId,
}: IRemoveUserEnchantTier) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  delete user.config.enchant;
  await saveUser(user);
  return user;
};

interface IGetUserEnchantTier {
  userId: string;
}

const getUserEnchantTier = async ({
  userId,
}: IGetUserEnchantTier): Promise<ValuesOf<typeof RPG_ENCHANT_LEVEL> | null> => {
  const user = await getUserAccount(userId);
  return user?.config.enchant ?? null;
};

interface IRemoveUserHealReminder {
  userId: string;
}

const removeUserHealReminder = async ({
  userId,
}: IRemoveUserHealReminder) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  delete user.config.heal;
  await saveUser(user);
  return user;
};

interface IGetUserHealReminder {
  userId: string;
}

const getUserHealReminder = async ({
  userId,
}: IGetUserHealReminder): Promise<number | null> => {
  const user = await getUserAccount(userId);
  return user?.config.heal ?? null;
};

interface ISetUserHealReminder {
  userId: string;
  hp: number;
}

const setUserHealReminder = async ({
  userId,
  hp,
}: ISetUserHealReminder) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  user.config.heal = hp;
  await saveUser(user);
  return user;
};

interface ISetUserReminderChannel {
  userId: string;
  commandType: (keyof IUser['channel'])[];
  channelId: string;
}

const setUserReminderChannel = async ({
  userId,
  commandType,
  channelId,
}: ISetUserReminderChannel) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  commandType.forEach((type) => {
    user.channel[type] = channelId;
  });
  await saveUser(user);
  return user;
};

interface IRemoveUserReminderChannel {
  userId: string;
  commandType: (keyof IUser['channel'])[];
}

const removeUserReminderChannel = async ({
  userId,
  commandType,
}: IRemoveUserReminderChannel) => {
  commandType = commandType.filter((type) => type !== 'all');
  const user = await getUserAccount(userId);
  if (!user) return;
  commandType.forEach((type) => {
    delete user.channel[type];
  });
  await saveUser(user);
  return user;
};

interface IGetUserReminderChannel {
  userId: string;
}

const getUserReminderChannel = async ({
  userId,
}: IGetUserReminderChannel): Promise<IUser['channel'] | null> => {
  const user = await getUserAccount(userId);
  return user?.channel ?? null;
};

const getUserToggle = async (userId: string): Promise<IUserToggle | null> => {
  const user = await getUserAccount(userId);
  return user?.toggle ?? null;
};

interface IUpdateUserToggle {
  userId: string;
  query: UpdateQuery<IUser>;
}

const updateUserToggle = async ({
  userId,
  query,
}: IUpdateUserToggle): Promise<null | IUser> => {
  await syncUser(userId);
  await dbUser.findOneAndUpdate(
    {
      userId,
    },
    query,
    {
      new: true,
    },
  );
  return await getUserAccount(userId);
};

interface IResetUserToggle {
  userId: string;
}

const resetUserToggle = async ({
  userId,
}: IResetUserToggle): Promise<IUser | null> => {
  await syncUser(userId);
  await dbUser.findOneAndUpdate(
    {
      userId,
    },
    {
      $unset: {
        toggle: '',
      },
    },
    {
      new: true,
    },
  );
  await redisUserAccount.delUser(userId);
  return await getUserAccount(userId);
};

interface IGetUserCustomMessage {
  userId: string;
}

const getUserCustomMessage = async ({
  userId,
}: IGetUserCustomMessage): Promise<IUser['customMessage'] | null> => {
  const user = await getUserAccount(userId);
  return user?.customMessage ?? null;
};

interface IUpdateUserCustomMessage {
  userId: string;
  type: keyof IUser['customMessage'];
  message: string;
}

const updateUserCustomMessage = async ({
  userId,
  type,
  message,
}: IUpdateUserCustomMessage) => {
  const user = await getUserAccount(userId);
  if (!user) return null;
  user.customMessage[type] = message;
  await saveUser(user);
  return user;
};

interface IResetUserCustomMessage {
  userId: string;
}

const resetUserCustomMessage = async ({
  userId,
}: IResetUserCustomMessage): Promise<IUser | null> => {
  await syncUser(userId);
  await dbUser.findOneAndUpdate(
    {
      userId,
    },
    {
      $unset: {
        customMessage: '',
      },
    },
    {
      new: true,
    },
  );
  await redisUserAccount.delUser(userId);
  return await getUserAccount(userId);
};

interface IIsUserAccountOn {
  userId: string;
}

const isUserAccountOn = async ({
  userId,
}: IIsUserAccountOn): Promise<boolean> => {
  const user = await getUserAccount(userId);
  return user?.config.onOff ?? false;
};

interface IGetBestStats {
  userId: string;
}

const getBestStats = async ({userId}: IGetBestStats) => {
  const user = await getUserAccount(userId);
  return user?.stats?.best ?? null;
};

interface IUpdateBestStats {
  userId: string;
  type: keyof typeof USER_STATS_RPG_COMMAND_TYPE;
  value: number;
}

const updateBestStats = async ({userId, type, value}: IUpdateBestStats) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  user.stats.best[type] = value;
  await saveUser(user);
  return user;
};

interface IUpdateUserMaxArea {
  userId: string;
  area: keyof typeof RPG_AREA;
}

const updateUserMaxArea = async ({userId, area}: IUpdateUserMaxArea) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  user.rpgInfo.maxArea = area;
  await saveUser(user);
  return user;
};

interface IUpdateUserCurrentArea {
  userId: string;
  area: keyof typeof RPG_AREA;
}

const updateUserCurrentArea = async ({userId, area}: IUpdateUserCurrentArea) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  user.rpgInfo.currentArea = area;
  await saveUser(user);
  return user;
};

interface IUpdateUserPocketWatch {
  userId: string;
  owned: boolean;
  percent: number;
}

const updateUserPocketWatch = async ({userId, percent, owned}: IUpdateUserPocketWatch) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  user.rpgInfo.artifacts.pocketWatch = {
    owned,
    percent,
  };
  await saveUser(user);
  return user;
};

interface ISaveUserPets {
  userId: string;
  pets: IUser['rpgInfo']['pets'];
}

const saveUserPets = async ({userId, pets}: ISaveUserPets) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  user.rpgInfo.pets = pets;
  await saveUser(user);
  return user;
};

interface ISaveUsersToDb {
  users: IUser[];
}

const saveUsersToDb = async ({users}: ISaveUsersToDb) => {
  await Promise.all(users.map(async (user) => {
    await dbUser.findOneAndUpdate(
      {userId: user.userId},
      user,
      {
        upsert: true,
      },
    );
  }));
};

interface ISaveUserGroupCooldowns {
  userId: string;
  users: string[];
  types: (keyof typeof RPG_COMMAND_TYPE)[];
}

const saveUserGroupCooldowns = async ({userId, users, types}: ISaveUserGroupCooldowns) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  for(const targetUserId of users) {
    const userCd = user.groupCooldowns.find((cd) => cd.userId === targetUserId);
    if (userCd) {
      userCd.types = types;
    } else {
      user.groupCooldowns.push({
        userId: targetUserId,
        types,
      });
    }
  }
  await saveUser(user);
  return user;
};

interface IResetGroupCooldowns {
  userId: string;
}

const resetGroupCooldowns = async ({userId}: IResetGroupCooldowns) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  user.groupCooldowns = [];
  await saveUser(user);
  return user;
};

interface IRemoveUsersFromGroupCooldowns {
  userId: string;
  users: string[];
}

const removeUsersFromGroupCooldowns = async ({userId, users}: IRemoveUsersFromGroupCooldowns) => {
  const user = await getUserAccount(userId);
  if (!user) return;
  user.groupCooldowns = user.groupCooldowns.filter((cd) => !users.includes(cd.userId));
  await saveUser(user);
  return user;
};

interface IGetUsersAccount {
  usersId: string[];
}

const getUsersAccount = async ({usersId}: IGetUsersAccount) => {
  const users: IUser[] = [];
  for (const userId of usersId) {
    const user = await getUserAccount(userId);
    if (user) users.push(user);
  }
  return users;

};

export const userService = {
  registerUserAccount,
  userAccountOn,
  userAccountOff,
  userAccountDelete,
  isUserAccountExist,
  updateRpgDonorTier,
  updateRpgDonorPTier,
  removeRpgDonorPTier,
  getUserAccount,
  updateUserRubyAmount,
  getUserRubyAmount,
  setUserEnchantTier,
  removeUserEnchantTier,
  getUserEnchantTier,
  removeUserHealReminder,
  getUserHealReminder,
  setUserHealReminder,
  setUserReminderChannel,
  removeUserReminderChannel,
  getUserReminderChannel,
  getUserToggle,
  updateUserToggle,
  resetUserToggle,
  getUserCustomMessage,
  resetUserCustomMessage,
  updateUserCustomMessage,
  isUserAccountOn,
  getBestStats,
  updateBestStats,
  updateUserMaxArea,
  updateUserCurrentArea,
  updateUserPocketWatch,
  saveUserPets,
  saveUsersToDb,
  saveUserGroupCooldowns,
  getUsersAccount,
  resetGroupCooldowns,
  removeUsersFromGroupCooldowns,
};
