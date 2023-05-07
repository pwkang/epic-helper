import {mongoClient} from '../../services/mongoose/mongoose.service';
import userSchema from './user.schema';

const dbUser = mongoClient.model('user', userSchema);

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
