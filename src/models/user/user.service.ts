import {mongoClient} from '../../services/mongoose/mongoose.service';
import userSchema from './user.schema';
import {IUser} from './user.type';

const dbUser = mongoClient.model<IUser>('user', userSchema);

interface RegisterUserProps {
  userId: string;
  username: string;
}

export const registerUserAccount = async ({
  userId,
  username,
}: RegisterUserProps): Promise<boolean> => {
  const user = await dbUser.findOne({userId});

  if (!user) {
    const newUser = new dbUser({
      userId,
      username,
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
