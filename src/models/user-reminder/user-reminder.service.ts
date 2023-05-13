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

interface ISaveUserAdventureCooldown {
  userId: string;
  readyAt?: Date;
  hardMode?: boolean;
}

export const saveUserAdventureCooldown = async ({
  userId,
  hardMode,
  readyAt,
}: ISaveUserAdventureCooldown): Promise<void> => {
  await dbUserReminder.findOneAndUpdate(
    {
      userId,
      type: RPG_COMMAND_TYPE.adventure,
    },
    {
      $set: {
        readyAt,
        props: {
          hardMode,
        },
      },
    },
    {
      upsert: true,
    }
  );
};

interface ISaveUserTrainingCooldown {
  userId: string;
  readyAt?: Date;
  ultraining?: boolean;
}

export const saveUserTrainingCooldown = async ({
  userId,
  readyAt,
  ultraining,
}: ISaveUserTrainingCooldown): Promise<void> => {
  await dbUserReminder.findOneAndUpdate(
    {
      userId,
      type: RPG_COMMAND_TYPE.training,
    },
    {
      $set: {
        readyAt,
        props: {
          ultraining,
        },
      },
    },
    {
      upsert: true,
    }
  );
};

interface ISaveUserQuestCooldown {
  userId: string;
  readyAt?: Date;
  epicQuest?: boolean;
}

export const saveUserQuestCooldown = async ({
  userId,
  readyAt,
  epicQuest,
}: ISaveUserQuestCooldown): Promise<void> => {
  await dbUserReminder.findOneAndUpdate(
    {
      userId,
      type: RPG_COMMAND_TYPE.quest,
    },
    {
      $set: {
        readyAt,
        props: {
          epicQuest,
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

interface IDeleteUserCooldown {
  userId: string;
  types: ValuesOf<typeof RPG_COMMAND_TYPE>[];
}

export const deleteUserCooldowns = async ({userId, types}: IDeleteUserCooldown) => {
  await dbUserReminder.deleteMany({
    userId,
    type: {$in: types},
  });
};

export const findUserReadyCommands = async (userId: string): Promise<IUserReminder[]> => {
  const reminderList = await dbUserReminder.find({
    userId,
    readyAt: {$lte: new Date()},
  });

  return reminderList ? reminderList.map((reminder) => reminder.toObject()) : [];
};
