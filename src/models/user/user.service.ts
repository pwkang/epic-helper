import {mongoClient} from '../../services/mongoose/mongoose.service';
import userSchema from './user.schema';
import {IUser} from './user.type';

const dbUser = mongoClient.model<IUser>('user', userSchema);

interface RegisterUserProps {
  userId: string;
  username: string;
}

export const registerUser = async ({userId, username}: RegisterUserProps): Promise<boolean> => {
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

export const accountOn = async (userId: string): Promise<void> => {
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
