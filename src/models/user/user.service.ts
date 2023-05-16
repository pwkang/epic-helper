import {mongoClient} from '../../services/mongoose/mongoose.service';
import userSchema from './user.schema';
import {IUser, RPG_DONOR_TIER} from './user.type';
import {
  redisGetUserRubyAmount,
  redisSetUserRubyAmount,
} from '../../services/redis/user-account.redis';
import {UpdateQuery} from 'mongoose';

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
  const cb = async () => {
    const user = await dbUser.findOne(
      {
        userId,
      },
      {
        projection: {
          'items.ruby': 1,
        },
      }
    );
    return user?.toJSON() as IUser;
  };

  return await redisGetUserRubyAmount(userId, cb);
};
