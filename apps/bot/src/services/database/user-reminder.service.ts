import {mongoClient} from '@epic-helper/services';
import {
  RPG_COMMAND_TYPE,
  RPG_FARM_SEED,
  RPG_LOOTBOX_TYPE,
  RPG_WORKING_TYPE,
} from '@epic-helper/constants';
import {IUserPet, IUserReminder, userReminderSchema} from '@epic-helper/models';
import {redisUserReminder} from '../redis/user-reminder.redis';
import {Model} from 'mongoose';

userReminderSchema.post('findOneAndUpdate', async function () {
  const updatedUserId = this.getQuery().userId;
  await updateNextReminderTime(updatedUserId, this.model);
});

userReminderSchema.post('deleteMany', async function () {
  const deletedUserId = this.getQuery().userId;
  await updateNextReminderTime(deletedUserId, this.model);
});

async function updateNextReminderTime(userId: string, model: Model<IUserReminder>) {
  const nextReminderTime = await model
    .find({
      userId,
    })
    .sort({readyAt: 1})
    .limit(1);
  if (nextReminderTime.length)
    await redisUserReminder.setReminderTime(userId, nextReminderTime[0].readyAt);
  else await redisUserReminder.deleteReminderTime(userId);
}

const dbUserReminder = mongoClient.model<IUserReminder>('user-reminder', userReminderSchema);

interface ISaveUserHuntCooldown {
  userId: string;
  readyAt?: Date;
  hardMode?: boolean;
  together?: boolean;
}

const saveUserHuntCooldown = async ({
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

const saveUserAdventureCooldown = async ({
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

const saveUserTrainingCooldown = async ({
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

const saveUserQuestCooldown = async ({
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

interface ISaveUserWorkingCooldown {
  userId: string;
  readyAt?: Date;
  workingType?: ValuesOf<typeof RPG_WORKING_TYPE>;
}

interface ISaveUserFarmCooldown {
  userId: string;
  readyAt?: Date;
  seedType?: ValuesOf<typeof RPG_FARM_SEED>;
}

const saveUserFarmCooldown = async ({
  userId,
  readyAt,
  seedType,
}: ISaveUserFarmCooldown): Promise<void> => {
  await dbUserReminder.findOneAndUpdate(
    {
      userId,
      type: RPG_COMMAND_TYPE.farm,
    },
    {
      $set: {
        readyAt,
        props: {
          seedType,
        },
      },
    },
    {
      upsert: true,
    }
  );
};

interface ISaveUserDailyCooldown {
  userId: string;
  readyAt?: Date;
}

const saveUserDailyCooldown = async ({userId, readyAt}: ISaveUserDailyCooldown): Promise<void> => {
  await dbUserReminder.findOneAndUpdate(
    {
      userId,
      type: RPG_COMMAND_TYPE.daily,
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

interface ISaveUserWeeklyCooldown {
  userId: string;
  readyAt?: Date;
}

const saveUserWeeklyCooldown = async ({
  userId,
  readyAt,
}: ISaveUserWeeklyCooldown): Promise<void> => {
  await dbUserReminder.findOneAndUpdate(
    {
      userId,
      type: RPG_COMMAND_TYPE.weekly,
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

const saveUserWorkingCooldown = async ({
  userId,
  readyAt,
  workingType,
}: ISaveUserWorkingCooldown): Promise<void> => {
  await dbUserReminder.findOneAndUpdate(
    {
      userId,
      type: RPG_COMMAND_TYPE.working,
    },
    {
      $set: {
        readyAt,
        props: {
          workingType,
        },
      },
    },
    {
      upsert: true,
    }
  );
};

interface ISaveUserLootboxCooldown {
  userId: string;
  readyAt?: Date;
  lootboxType?: ValuesOf<typeof RPG_LOOTBOX_TYPE>;
}

const saveUserLootboxCooldown = async ({
  userId,
  readyAt,
  lootboxType,
}: ISaveUserLootboxCooldown): Promise<void> => {
  await dbUserReminder.findOneAndUpdate(
    {
      userId,
      type: RPG_COMMAND_TYPE.lootbox,
    },
    {
      $set: {
        readyAt,
        props: {
          lootboxType,
        },
      },
    },
    {
      upsert: true,
    }
  );
};

interface ISaveUserPetCooldown {
  userId: string;
  readyAt: IUserPet['readyAt'];
}

const saveUserPetCooldown = async ({userId, readyAt}: ISaveUserPetCooldown): Promise<void> => {
  await dbUserReminder.findOneAndUpdate(
    {
      userId,
      type: RPG_COMMAND_TYPE.pet,
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

interface IUpdateUserCooldown {
  userId: string;
  type: ValuesOf<typeof RPG_COMMAND_TYPE>;
  readyAt?: Date;
}

const updateUserCooldown = async ({userId, readyAt, type}: IUpdateUserCooldown) => {
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

const deleteUserCooldowns = async ({userId, types}: IDeleteUserCooldown) => {
  await dbUserReminder.deleteMany({
    userId,
    type: {$in: types},
  });
};

const findUserReadyCommands = async (userId: string): Promise<IUserReminder[]> => {
  const reminderList = await dbUserReminder.find({
    userId,
    readyAt: {$lte: new Date()},
  });

  return reminderList ? reminderList.map((reminder) => reminder.toObject()) : [];
};

const getUserAllCooldowns = async (userId: string): Promise<IUserReminder[]> => {
  const reminderList = await dbUserReminder.find({
    userId,
  });

  return reminderList ? reminderList.map((reminder) => reminder.toObject()) : [];
};

const clearUserCooldowns = async (userId: string): Promise<void> => {
  await dbUserReminder.deleteMany({
    userId,
  });
};

export const userReminderServices = {
  saveUserAdventureCooldown,
  saveUserHuntCooldown,
  saveUserTrainingCooldown,
  saveUserQuestCooldown,
  saveUserFarmCooldown,
  saveUserDailyCooldown,
  saveUserWeeklyCooldown,
  saveUserWorkingCooldown,
  saveUserLootboxCooldown,
  saveUserPetCooldown,
  updateUserCooldown,
  deleteUserCooldowns,
  findUserReadyCommands,
  getUserAllCooldowns,
  clearUserCooldowns,
};
