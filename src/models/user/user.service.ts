import {mongoClient} from '../../services/mongoose/mongoose.service';
import userSchema from './user.schema';
import {IUser, IUserToggle} from './user.type';
import userAccountRedis from '../../services/redis/user-account.redis';
import {UpdateQuery} from 'mongoose';
import {RPG_ENCHANT_LEVEL} from '../../constants/epic-rpg/enchant';
import {RPG_DONOR_TIER} from '../../constants/epic-rpg/rpg';

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
  const user = await dbUser.findOne({userId});

  if (!user) {
    const newUser = new dbUser({
      userId,
      username,
      config: {
        channel: channelId,
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
    }
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
    }
  );
};

const userAccountDelete = async (userId: string): Promise<void> => {
  await dbUser.findOneAndDelete({
    userId,
  });
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
    }
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
    }
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
    }
  );
};

const toggleHuntSwitch = async (userId: string): Promise<boolean> => {
  let user = await dbUser.findOne({
    userId,
  });
  if (!user) return false;
  user.config.huntSwitch = !user.config.huntSwitch;
  await user.save();
  return user.config.huntSwitch;
};

const getUserAccount = async (userId: string): Promise<IUser | null> => {
  return dbUser.findOne({
    userId,
  });
};

interface IUpdateUserRubyAmount {
  userId: string;
  ruby: number;
  type: 'set' | 'inc' | 'dec';
}

const updateUserRubyAmount = async ({ruby, userId, type}: IUpdateUserRubyAmount): Promise<void> => {
  let query: UpdateQuery<IUser> = {};
  if (type === 'set') {
    query.$set = {
      'items.ruby': ruby,
    };
  } else {
    query.$inc = {
      'items.ruby': type === 'inc' ? ruby : -ruby,
    };
  }
  const user = await dbUser.findOneAndUpdate(
    {
      userId,
    },
    query,
    {
      new: true,
      projection: {
        'items.ruby': 1,
      },
    }
  );
  if (user) await userAccountRedis.setRuby(userId, user.items.ruby);
};

const getUserRubyAmount = async (userId: string): Promise<number> => {
  return userAccountRedis.getRuby(userId, async () => {
    const user = await dbUser.findOne(
      {
        userId,
      },
      {
        'items.ruby': 1,
      }
    );
    return user?.toObject() as IUser;
  });
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
    }
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
    }
  );
};

interface IGetUserEnchantTier {
  userId: string;
}

const getUserEnchantTier = async ({
  userId,
}: IGetUserEnchantTier): Promise<ValuesOf<typeof RPG_ENCHANT_LEVEL> | null> => {
  const user = await dbUser.findOne(
    {
      userId,
    },
    {
      'config.enchant': 1,
    }
  );
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
    }
  );
};

interface IGetUserHealReminder {
  userId: string;
}

const getUserHealReminder = async ({userId}: IGetUserHealReminder): Promise<number | null> => {
  const user = await dbUser.findOne(
    {
      userId,
    },
    {
      'config.heal': 1,
    }
  );
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
    }
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
    }
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
    }
  );
};

interface IGetUserReminderChannel {
  userId: string;
}

const getUserReminderChannel = async ({
  userId,
}: IGetUserReminderChannel): Promise<IUser['channel'] | null> => {
  const user = await dbUser.findOne(
    {
      userId,
    },
    {
      channel: 1,
    }
  );
  return user?.channel ?? null;
};

const getUserToggle = async (userId: string): Promise<IUserToggle | null> => {
  const user = await dbUser.findOne(
    {
      userId,
    },
    {
      toggle: 1,
    }
  );
  return user?.toggle ?? null;
};

interface IUpdateUserToggle {
  userId: string;
  query: UpdateQuery<IUser>;
}

const updateUserToggle = async ({
  userId,
  query,
}: IUpdateUserToggle): Promise<null | IUserToggle> => {
  const user = await dbUser.findOneAndUpdate(
    {
      userId,
    },
    query,
    {
      new: true,
      projection: {
        toggle: 1,
      },
    }
  );
  if (!user) return null;
  return user.toggle;
};

interface IResetUserToggle {
  userId: string;
}

const resetUserToggle = async ({userId}: IResetUserToggle): Promise<IUserToggle | null> => {
  const user = await dbUser.findOneAndUpdate(
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
      projection: {
        toggle: 1,
      },
    }
  );

  return user?.toggle ?? null;
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
  toggleHuntSwitch,
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
};
