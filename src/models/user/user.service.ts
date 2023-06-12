import {mongoClient} from '../../services/mongoose/mongoose.service';
import userSchema from './user.schema';
import {IUser} from './user.type';
import {
  redisGetUserRubyAmount,
  redisSetUserRubyAmount,
} from '../../services/redis/user-account.redis';
import {UpdateQuery} from 'mongoose';
import {ENCHANT_LEVEL} from '../../constants/epic_rpg/enchant';
import {RPG_DONOR_TIER} from '../../constants/epic_rpg/rpg';

const dbUser = mongoClient.model<IUser>('user', userSchema);

interface RegisterUserProps {
  userId: string;
  username: string;
  channelId: string;
}

export const registerUserAccount = async ({
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

export const userAccountOn = async (userId: string): Promise<void> => {
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

export const userAccountOff = async (userId: string): Promise<void> => {
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

export const userAccountDelete = async (userId: string): Promise<void> => {
  await dbUser.findOneAndDelete({
    userId,
  });
};
export const isUserAccountExist = async (userId: string): Promise<boolean> => {
  const user = await dbUser.count({
    userId,
  });
  return user > 0;
};

interface IUpdateRpgDonorTier {
  userId: string;
  tier: ValuesOf<typeof RPG_DONOR_TIER>;
}

export const updateRpgDonorTier = async ({userId, tier}: IUpdateRpgDonorTier): Promise<void> => {
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

export const updateRpgDonorPTier = async ({userId, tier}: IUpdateRpgDonorPTier): Promise<void> => {
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

export const removeRpgDonorPTier = async (userId: string): Promise<void> => {
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

export const toggleHuntSwitch = async (userId: string): Promise<boolean> => {
  let user = await dbUser.findOne({
    userId,
  });
  if (!user) return false;
  user.config.huntSwitch = !user.config.huntSwitch;
  await user.save();
  return user.config.huntSwitch;
};

export const getUserAccount = async (userId: string): Promise<IUser | null> => {
  return dbUser.findOne({
    userId,
  });
};

interface IUpdateUserRubyAmount {
  userId: string;
  ruby: number;
  type: 'set' | 'inc' | 'dec';
}

export const updateUserRubyAmount = async ({
  ruby,
  userId,
  type,
}: IUpdateUserRubyAmount): Promise<void> => {
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
  if (user) await redisSetUserRubyAmount(userId, user.items.ruby);
};

export const getUserRubyAmount = async (userId: string): Promise<number> => {
  return redisGetUserRubyAmount(userId, async () => {
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
  tier: ValuesOf<typeof ENCHANT_LEVEL>;
}

export const setUserEnchantTier = async ({userId, tier}: ISetUserEnchantTier): Promise<void> => {
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

export const removeUserEnchantTier = async ({userId}: IRemoveUserEnchantTier): Promise<void> => {
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

export const getUserEnchantTier = async ({
  userId,
}: IGetUserEnchantTier): Promise<ValuesOf<typeof ENCHANT_LEVEL> | null> => {
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

export const removeUserHealReminder = async ({userId}: IRemoveUserHealReminder): Promise<void> => {
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

export const getUserHealReminder = async ({
  userId,
}: IGetUserHealReminder): Promise<number | null> => {
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

export const setUserHealReminder = async ({userId, hp}: ISetUserHealReminder): Promise<void> => {
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

export const setUserReminderChannel = async ({
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

export const removeUserReminderChannel = async ({
  userId,
  commandType,
}: IRemoveUserReminderChannel) => {
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

export const getUserReminderChannel = async ({
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
