import type {RPG_EPIC_ITEM_TYPES, RPG_FARM_SEED, RPG_LOOTBOX_TYPE, RPG_WORKING_TYPE} from '@epic-helper/constants';
import {RPG_COMMAND_TYPE} from '@epic-helper/constants';
import type {IUserReminder} from '@epic-helper/models';
import {userReminderSchema} from '@epic-helper/models';
import {redisUserNextReminderTime} from '../redis/user-next-reminder-time.redis';
import {mongoClient} from '../clients/mongoose.service';
import type {ValuesOf} from '@epic-helper/types';
import {redisUserReminder} from '../redis/user-reminder.redis';

const dbUserReminder = mongoClient.model<IUserReminder>(
  'user-reminders',
  userReminderSchema,
);

const saveReminder = async (userId: string, reminder: IUserReminder) => {
  reminder.updatedAt = new Date();
  await redisUserReminder.setReminder(userId, reminder.type, reminder);
  const userReminders = await getUserAllCooldowns(userId);
  const nextReminderTime = userReminders
    .filter((reminder) => reminder.readyAt)
    .sort((a, b) => {
      if (!a.readyAt || !b.readyAt) return 0;
      return a.readyAt.getTime() - b.readyAt.getTime();
    });
  if (nextReminderTime.length && nextReminderTime[0].readyAt) {
    await redisUserNextReminderTime.setReminderTime(
      userId,
      nextReminderTime[0].readyAt,
    );
  }
};

interface ISaveUserHuntCooldown {
  userId: string;
  readyAt?: Date;
  hardMode?: boolean;
  together?: boolean;
}

const saveUserHuntCooldown = async ({
  userId,
  readyAt,
  together = false,
  hardMode,
}: ISaveUserHuntCooldown): Promise<void> => {
  const reminder: IUserReminder = {
    type: RPG_COMMAND_TYPE.hunt,
    readyAt,
    userId,
    props: {
      together,
      hardMode,
    },
  };
  await saveReminder(userId, reminder);
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
  const reminder: IUserReminder = {
    type: RPG_COMMAND_TYPE.adventure,
    readyAt,
    userId,
    props: {
      hardMode,
    },
  };
  await saveReminder(userId, reminder);
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
  const reminder: IUserReminder = {
    type: RPG_COMMAND_TYPE.training,
    readyAt,
    userId,
    props: {
      ultraining,
    },
  };
  await saveReminder(userId, reminder);
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
  const reminder: IUserReminder = {
    type: RPG_COMMAND_TYPE.quest,
    readyAt,
    userId,
    props: {
      epicQuest,
    },
  };
  await saveReminder(userId, reminder);
};

interface ISaveUserWorkingCooldown {
  userId: string;
  readyAt?: Date;
  workingType?: ValuesOf<typeof RPG_WORKING_TYPE>;
}

const saveUserWorkingCooldown = async ({
  userId,
  readyAt,
  workingType,
}: ISaveUserWorkingCooldown): Promise<void> => {
  const reminder: IUserReminder = {
    type: RPG_COMMAND_TYPE.working,
    readyAt,
    userId,
    props: {
      workingType,
    },
  };
  await saveReminder(userId, reminder);
};


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
  const reminder: IUserReminder = {
    type: RPG_COMMAND_TYPE.farm,
    readyAt,
    userId,
    props: {
      seedType,
    },
  };
  await saveReminder(userId, reminder);
};

interface ISaveUserDuelCooldown {
  userId: string;
  readyAt?: Date;
}

const saveUserDuelCooldown = async ({
  userId,
  readyAt,
}: ISaveUserDuelCooldown): Promise<void> => {
  const reminder: IUserReminder = {
    type: RPG_COMMAND_TYPE.duel,
    readyAt,
    userId,
  };
  await saveReminder(userId, reminder);
};

interface ISaveUserDailyCooldown {
  userId: string;
  readyAt?: Date;
}

const saveUserDailyCooldown = async ({
  userId,
  readyAt,
}: ISaveUserDailyCooldown): Promise<void> => {
  const reminder: IUserReminder = {
    type: RPG_COMMAND_TYPE.daily,
    readyAt,
    userId,
  };
  await saveReminder(userId, reminder);
};

interface ISaveUserWeeklyCooldown {
  userId: string;
  readyAt?: Date;
}

const saveUserWeeklyCooldown = async ({
  userId,
  readyAt,
}: ISaveUserWeeklyCooldown): Promise<void> => {
  const reminder: IUserReminder = {
    type: RPG_COMMAND_TYPE.weekly,
    readyAt,
    userId,
  };
  await saveReminder(userId, reminder);
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
  const reminder: IUserReminder = {
    type: RPG_COMMAND_TYPE.lootbox,
    readyAt,
    userId,
    props: {
      lootboxType,
    },
  };
  await saveReminder(userId, reminder);
};

interface ISaveUserEpicItemCooldown {
  userId: string;
  readyAt?: Date;
  epicItemType?: ValuesOf<typeof RPG_EPIC_ITEM_TYPES>;
}

const saveUserEpicItemCooldown = async ({
  userId,
  readyAt,
  epicItemType,
}: ISaveUserEpicItemCooldown): Promise<void> => {
  const reminder: IUserReminder = {
    type: RPG_COMMAND_TYPE.epicItem,
    readyAt,
    userId,
    props: {
      epicItemType,
    },
  };
  await saveReminder(userId, reminder);
};

interface ISaveUserPetCooldown {
  userId: string;
  readyAt?: Date;
}

const saveUserPetCooldown = async ({
  userId,
  readyAt,
}: ISaveUserPetCooldown): Promise<void> => {
  const reminder: IUserReminder = {
    type: RPG_COMMAND_TYPE.pet,
    readyAt,
    userId,
  };
  await saveReminder(userId, reminder);
};

interface ISaveUserXmasChimneyCooldown {
  userId: string;
  readyAt: Date;
}

const saveUserXmasChimneyCooldown = async ({
  userId,
  readyAt,
}: ISaveUserXmasChimneyCooldown): Promise<void> => {
  const reminder: IUserReminder = {
    type: RPG_COMMAND_TYPE.xmasChimney,
    readyAt,
    userId,
  };
  await saveReminder(userId, reminder);
};


interface IUpdateUserCooldown {
  userId: string;
  type: ValuesOf<typeof RPG_COMMAND_TYPE>;
  readyAt?: Date;
}

const updateUserCooldown = async ({
  userId,
  readyAt,
  type,
}: IUpdateUserCooldown) => {
  const cooldown = await findUserCooldown({
    userId,
    type,
  });
  if (!cooldown) return;
  cooldown.readyAt = readyAt;
  await saveReminder(userId, cooldown);
};

interface IDeleteUserCooldown {
  userId: string;
  types: ValuesOf<typeof RPG_COMMAND_TYPE>[];
}

const deleteUserCooldowns = async ({userId, types}: IDeleteUserCooldown) => {
  await redisUserReminder.clearReminders(userId, types);
};

const findUserReadyCommands = async (
  userId: string,
): Promise<IUserReminder[]> => {
  const userReminders = await getUserAllCooldowns(userId);
  return userReminders.filter((reminder) => reminder.readyAt && reminder.readyAt.getTime() < new Date().getTime());
};

const getUserAllCooldowns = async (
  userId: string,
): Promise<IUserReminder[]> => {
  return Promise.all(
    Object.values(RPG_COMMAND_TYPE).map(async (type) => findUserCooldown({
      userId, type,
    })),
  );
};

const clearUserCooldowns = async (userId: string): Promise<void> => {
  await redisUserReminder.clearReminders(userId, Object.values(RPG_COMMAND_TYPE));
  await dbUserReminder.deleteMany({
    userId,
  });
};

interface IGetNextReadyCommand {
  userId: string;
}

const getNextReadyCommand = async ({
  userId,
}: IGetNextReadyCommand): Promise<IUserReminder | null> => {
  let userReminders = await getUserAllCooldowns(userId);
  if (!userReminders.length) return null;
  userReminders = userReminders.filter(reminder =>
    reminder.readyAt && reminder.readyAt >= new Date(),
  ).sort((a, b) => {
    if (!a.readyAt || !b.readyAt) return 0;
    return a.readyAt.getTime() - b.readyAt.getTime();
  });
  return userReminders[0];
};

interface IUpdateRemindedCooldowns {
  userId: string;
  types: ValuesOf<typeof RPG_COMMAND_TYPE>[];
}

const updateRemindedCooldowns = async ({
  userId,
  types,
}: IUpdateRemindedCooldowns) => {
  await Promise.all(types.map(async (type) => {
    const cooldown = await findUserCooldown({
      userId,
      type,
    });
    if (!cooldown) return;
    delete cooldown.readyAt;
    await saveReminder(userId, cooldown);
  }));
};

interface IFindUserCooldown {
  userId: string;
  type: ValuesOf<typeof RPG_COMMAND_TYPE>;
}

const findUserCooldown = async ({
  userId,
  type,
}: IFindUserCooldown): Promise<IUserReminder> => {
  const data = await redisUserReminder.getReminder(userId, type);
  if (data) return data;
  const dbData = await dbUserReminder.findOne({
    userId,
    type,
  });
  if (dbData) return dbData.toObject();
  return {
    userId,
    type,
  } as IUserReminder;
};

interface ISaveRemindersToDb {
  reminders: IUserReminder[];
}

const saveRemindersToDb = async ({
  reminders,
}: ISaveRemindersToDb): Promise<void> => {
  await Promise.all(reminders.map(async (reminder) => {
    await dbUserReminder.findOneAndUpdate({
      userId: reminder.userId,
      type: reminder.type,
    }, reminder, {
      upsert: true,
    });
  }));
};

export const userReminderServices = {
  saveUserAdventureCooldown,
  saveUserHuntCooldown,
  saveUserTrainingCooldown,
  saveUserQuestCooldown,
  saveUserEpicItemCooldown,
  saveUserFarmCooldown,
  saveUserDuelCooldown,
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
  getNextReadyCommand,
  updateRemindedCooldowns,
  findUserCooldown,
  saveUserXmasChimneyCooldown,
  saveRemindersToDb,
};
