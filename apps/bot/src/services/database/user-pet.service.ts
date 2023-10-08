import type {Model} from 'mongoose';
import {type FilterQuery, type QueryOptions} from 'mongoose';
import {mongoClient} from '@epic-helper/services';
import {RPG_PET_ADV_STATUS} from '@epic-helper/constants';
import {type IUserPet, userPetSchema} from '@epic-helper/models';
import {userReminderServices} from './user-reminder.service';
import 'mongodb';

userPetSchema.post('findOneAndUpdate', async function () {
  const updatedUserId = this.getQuery().userId;
  await updateNextPetReminderTime(updatedUserId, this.model);
});

userPetSchema.post('updateMany', async function () {
  const updatedUserId = this.getQuery().userId;
  await updateNextPetReminderTime(updatedUserId, this.model);
});

async function updateNextPetReminderTime(
  userId: string,
  model: Model<IUserPet>
) {
  const nextReminderTime = await model
    .find({
      userId,
      readyAt: {$gt: new Date()}
    })
    .sort({readyAt: 1})
    .limit(1);
  if (!nextReminderTime.length)
    await userReminderServices.updateRemindedCooldowns({
      userId,
      types: ['pet']
    });
  else
    await userReminderServices.saveUserPetCooldown({
      userId,
      readyAt: nextReminderTime[0].readyAt
    });
}

const dbUserPet = mongoClient.model<IUserPet>('user-pet', userPetSchema);

interface IGetUserPets {
  userId: string;
  petsId?: number[];
  page?: number;
  limit?: number;
  status?: ValuesOf<typeof RPG_PET_ADV_STATUS>[];
  orderBy?: 'petId' | 'readyAt';
}

const getUserPets = async ({
  userId,
  petsId,
  page,
  limit,
  status,
  orderBy = 'petId'
}: IGetUserPets) => {
  const query: FilterQuery<IUserPet> = {
    userId
  };
  if (petsId) {
    query.petId = {
      $in: petsId
    };
  }
  if (status) {
    query.status = {
      $in: status
    };
  }
  const options: QueryOptions<IUserPet> = {};
  if (orderBy) {
    options.sort = {
      [orderBy]: 1
    };
  }
  if (page !== undefined && limit) {
    options.skip = page * limit;
    options.limit = limit;
  }
  return dbUserPet.find(query, null, options).lean();
};

interface ICalcTotalPets {
  userId: string;
  status?: ValuesOf<typeof RPG_PET_ADV_STATUS>[];
}

const calcTotalPets = async ({userId, status}: ICalcTotalPets) => {
  const query: FilterQuery<IUserPet> = {
    userId
  };
  if (status) {
    query.status = {
      $in: status
    };
  }
  return dbUserPet.countDocuments(query);
};

interface ICreateUserPet {
  userId: string;
  pet: IUserPet;
}

const createUserPet = async ({userId, pet}: ICreateUserPet) => {
  return dbUserPet.findOneAndUpdate(
    {
      userId,
      petId: pet.petId
    },
    {
      $set: pet
    },
    {
      upsert: true
    }
  );
};

interface IUpdateUserPet {
  userId: string;
  pet: IUserPet;
}

const updateUserPet = async ({userId, pet}: IUpdateUserPet) => {
  return dbUserPet.findOneAndUpdate(
    {
      userId,
      petId: pet.petId
    },
    {
      $set: pet
    }
  );
};

interface IDeleteExtraPets {
  userId: string;
  maxPetId: number;
}

const deleteExtraPets = async ({userId, maxPetId}: IDeleteExtraPets) => {
  return dbUserPet.deleteMany({
    userId,
    petId: {
      $gt: maxPetId
    }
  });
};

interface IGetUserReadyPets {
  userId: string;
}

const getUserReadyPets = async ({userId}: IGetUserReadyPets) => {
  return dbUserPet.find({
    userId,
    readyAt: {
      $lte: new Date()
    }
  });
};

interface IUpdateRemindedPets {
  userId: string;
  petIds: number[];
}

const updateRemindedPets = async ({userId, petIds}: IUpdateRemindedPets) => {
  return dbUserPet.updateMany(
    {
      userId,
      petId: {
        $in: petIds
      }
    },
    {
      $unset: {
        readyAt: 1
      },
      $set: {
        status: RPG_PET_ADV_STATUS.back
      }
    }
  );
};

interface IGetAvailableEpicPets {
  userId: string;
}

const getAvailableEpicPets = async ({userId}: IGetAvailableEpicPets) => {
  return dbUserPet.find({
    userId,
    status: RPG_PET_ADV_STATUS.idle,
    'skills.epic': {
      $ne: null
    }
  });
};

interface IGetAdventureEpicPets {
  userId: string;
}

const getAdventureEpicPets = async ({userId}: IGetAdventureEpicPets) => {
  return dbUserPet.find({
    userId,
    status: {
      $in: [RPG_PET_ADV_STATUS.adventure, RPG_PET_ADV_STATUS.back]
    },
    'skills.epic': {
      $ne: null
    }
  });
};

const claimAllPets = async ({userId}: {userId: string}) => {
  return dbUserPet.updateMany(
    {
      userId,
      $or: [
        {
          status: RPG_PET_ADV_STATUS.back
        },
        {
          readyAt: {
            $lte: new Date()
          }
        }
      ]
    },
    {
      $set: {
        status: RPG_PET_ADV_STATUS.idle
      },
      $unset: {
        readyAt: 1
      }
    }
  );
};

const resetUserPetsAdvStatus = async (userId: string) => {
  return dbUserPet.updateMany(
    {
      userId
    },
    {
      $set: {
        status: RPG_PET_ADV_STATUS.idle
      },
      $unset: {
        readyAt: 1
      }
    }
  );
};

interface IClearUserPets {
  userId: string;
}

const clearUserPets = async ({userId}: IClearUserPets) => {
  return dbUserPet.deleteMany({
    userId
  });
};

interface ICancelAdventurePets {
  userId: string;
  petIds: number[];
}

const cancelAdventurePets = async ({userId, petIds}: ICancelAdventurePets) => {
  return dbUserPet.updateMany(
    {
      userId,
      petId: {
        $in: petIds
      }
    },
    {
      $set: {
        status: RPG_PET_ADV_STATUS.idle
      },
      $unset: {
        readyAt: 1
      }
    }
  );
};

export const userPetServices = {
  getUserPets,
  calcTotalPets,
  createUserPet,
  updateUserPet,
  deleteExtraPets,
  getUserReadyPets,
  updateRemindedPets,
  getAvailableEpicPets,
  getAdventureEpicPets,
  claimAllPets,
  resetUserPetsAdvStatus,
  clearUserPets,
  cancelAdventurePets
};
