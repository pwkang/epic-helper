import {mongoClient} from '../../services/mongoose/mongoose.service';
import {IUserReminder} from './user-reminder.type';
import userReminderSchema from './user-reminder.schema';
import {RPG_COMMAND_TYPE} from '../../constants/rpg';

const dbUserReminder = mongoClient.model<IUserReminder>('user-reminder', userReminderSchema);

interface ISaveUserHuntCooldown {
  userId: string;
  readyAt?: Date;
  hardMode?: boolean;
  together?: boolean;
}

export const saveUserHuntCooldown = async ({
  userId,
  together,
  readyAt,
  hardMode,
}: ISaveUserHuntCooldown): Promise<void> => {
  await dbUserReminder.findOneAndUpdate(
    {
      userId,
      type: RPG_COMMAND_TYPE.hunt,
    },
    {
      $set: {
        readyAt,
        props: {
          together,
          hardMode,
        },
      },
    },
    {
      upsert: true,
    }
  );
};

interface IUpdateUserCooldown {
  userId: string;
  type: ValuesOf<typeof RPG_COMMAND_TYPE>;
  readyAt?: Date;
}

export const updateUserCooldown = async ({userId, readyAt, type}: IUpdateUserCooldown) => {
  await dbUserReminder.findOneAndUpdate(
    {
      userId,
      type,
    },
    {
      $set: {
        readyAt,
      },
    },
    {
      upsert: true,
    }
  );
};
