import type {UpdateQuery} from 'mongoose';
import {mongoClient} from '@epic-helper/services';
import {RPG_DONOR_TIER, RPG_ENCHANT_LEVEL} from '@epic-helper/constants';
import userAccountRedis from '../redis/user-account.redis';
import {IUser, IUserToggle, userSchema} from '@epic-helper/models';
import mongooseLeanDefaults from 'mongoose-lean-defaults';
import redisUserAccount from '../redis/user-account.redis';

userSchema.post('findOneAndUpdate', async function (doc) {
  if (!doc) return;
  await userAccountRedis.setUser(doc.userId, doc);
});

userSchema.plugin(mongooseLeanDefaults);

const dbUser = mongoClient.model<IUser>('user', userSchema);

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

const userAccountOn = async (userId: string): Promise<void> => {
  await dbUser.findOneAndUpdate(
    {
      userId,
    },
    {
      $set: {
        'config.onOff': true,
      },
    },
    {new: true}
  );
};

const userAccountOff = async (userId: string): Promise<void> => {
  await dbUser.findOneAndUpdate(
    {
      userId,
    },
    {
      $set: {
        'config.onOff': false,
      },
    },
    {new: true}
  );
};

const userAccountDelete = async (userId: string): Promise<void> => {
  await dbUser.findOneAndDelete({
    userId,
  });
  await redisUserAccount.delUser(userId);
};

const isUserAccountExist = async (userId: string): Promise<boolean> => {
  const user = await dbUser.count({
    userId,
  });
  return user > 0;
};

interface IUpdateRpgDonorTier {
  userId: string;
  tier: ValuesOf<typeof RPG_DONOR_TIER>;
}

const updateRpgDonorTier = async ({userId, tier}: IUpdateRpgDonorTier): Promise<void> => {
  await dbUser.findOneAndUpdate(
    {
      userId,
    },
    {
      $set: {
        'config.donor': tier,
      },
    },
    {new: true}
  );
};

interface IUpdateRpgDonorPTier {
  userId: string;
  tier: ValuesOf<typeof RPG_DONOR_TIER> | null;
}

const updateRpgDonorPTier = async ({userId, tier}: IUpdateRpgDonorPTier): Promise<void> => {
  await dbUser.findOneAndUpdate(
    {
      userId,
    },
    {
      $set: {
        'config.donorP': tier,
      },
    },
    {new: true}
  );
};

const removeRpgDonorPTier = async (userId: string): Promise<void> => {
  await dbUser.findOneAndUpdate(
    {
      userId,
    },
    {
      $unset: {
        'config.donorP': '',
      },
    },
    {new: true}
  );
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

interface IUpdateUserRubyAmount {
  userId: string;
  ruby: number;
  type: 'set' | 'inc' | 'dec';
}

const updateUserRubyAmount = async ({ruby, userId, type}: IUpdateUserRubyAmount): Promise<void> => {
  const query: UpdateQuery<IUser> = {};
  if (type === 'set') {
    query.$set = {
      'items.ruby': ruby,
    };
  } else {
    query.$inc = {
      'items.ruby': type === 'inc' ? ruby : -ruby,
    };
  }
  await dbUser.findOneAndUpdate(
    {
      userId,
    },
    query,
    {
      new: true,
    }
  );
};

const getUserRubyAmount = async (userId: string): Promise<number> => {
  const user = await getUserAccount(userId);
  return user?.items.ruby ?? 0;
};

interface ISetUserEnchantTier {
  userId: string;
  tier: ValuesOf<typeof RPG_ENCHANT_LEVEL>;
}

const setUserEnchantTier = async ({userId, tier}: ISetUserEnchantTier): Promise<void> => {
  await dbUser.findOneAndUpdate(
    {
      userId,
    },
    {
      $set: {
        'config.enchant': tier,
      },
    },
    {new: true}
  );
};

interface IRemoveUserEnchantTier {
  userId: string;
}

const removeUserEnchantTier = async ({userId}: IRemoveUserEnchantTier): Promise<void> => {
  await dbUser.findOneAndUpdate(
    {
      userId,
    },
    {
      $unset: {
        'config.enchant': '',
      },
    },
    {new: true}
  );
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

const removeUserHealReminder = async ({userId}: IRemoveUserHealReminder): Promise<void> => {
  await dbUser.findOneAndUpdate(
    {
      userId,
    },
    {
      $unset: {
        'config.heal': '',
      },
    },
    {new: true}
  );
};

interface IGetUserHealReminder {
  userId: string;
}

const getUserHealReminder = async ({userId}: IGetUserHealReminder): Promise<number | null> => {
  const user = await getUserAccount(userId);
  return user?.config.heal ?? null;
};

interface ISetUserHealReminder {
  userId: string;
  hp: number;
}

const setUserHealReminder = async ({userId, hp}: ISetUserHealReminder): Promise<void> => {
  await dbUser.findOneAndUpdate(
    {
      userId,
    },
    {
      $set: {
        'config.heal': hp,
      },
    },
    {new: true}
  );
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
  const updateQuery: Record<string, string> = {};
  commandType.forEach((type) => {
    updateQuery[`channel.${type}`] = channelId;
  });
  await dbUser.findOneAndUpdate(
    {
      userId,
    },
    {
      $set: updateQuery,
    },
    {new: true}
  );
};

interface IRemoveUserReminderChannel {
  userId: string;
  commandType: (keyof IUser['channel'])[];
}

const removeUserReminderChannel = async ({userId, commandType}: IRemoveUserReminderChannel) => {
  const updateQuery: Record<string, string> = {};
  commandType.forEach((type) => {
    if (type === 'all') return;
    updateQuery[`channel.${type}`] = '';
  });
  await dbUser.findOneAndUpdate(
    {
      userId,
    },
    {
      $unset: updateQuery,
    },
    {new: true}
  );
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

const updateUserToggle = async ({userId, query}: IUpdateUserToggle): Promise<null | IUser> => {
  await dbUser.findOneAndUpdate(
    {
      userId,
    },
    query,
    {
      new: true,
    }
  );
  return await getUserAccount(userId);
};

interface IResetUserToggle {
  userId: string;
}

const resetUserToggle = async ({userId}: IResetUserToggle): Promise<IUser | null> => {
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
    }
  );

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
}: IUpdateUserCustomMessage): Promise<IUser | null> => {
  await dbUser.findOneAndUpdate(
    {
      userId,
    },
    {
      $set: {
        [`customMessage.${type}`]: message,
      },
    },
    {
      new: true,
    }
  );
  return await getUserAccount(userId);
};

interface IResetUserCustomMessage {
  userId: string;
}

const resetUserCustomMessage = async ({userId}: IResetUserCustomMessage): Promise<IUser | null> => {
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
    }
  );
  return await getUserAccount(userId);
};

interface IIsUserAccountOn {
  userId: string;
}

const isUserAccountOn = async ({userId}: IIsUserAccountOn): Promise<boolean> => {
  const user = await getUserAccount(userId);
  return user?.config.onOff ?? false;
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
};
