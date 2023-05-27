import {mongoClient} from '../../services/mongoose/mongoose.service';
import {IUserPet} from './user-pet.type';
import userPetSchema from './user-pet.schema';
import {RPG_PET_STATUS} from '../../constants/pet';
import {QueryOptions} from 'mongoose';

const dbUserPet = mongoClient.model<IUserPet>('user-pet', userPetSchema);

interface IGetUserPets {
  userId: string;
  petsId?: number[];
  page?: number;
  limit?: number;
}

export const getUserPets = async ({userId, petsId, page, limit}: IGetUserPets) => {
  const query: any = {
    userId,
  };
  const options: QueryOptions<IUserPet> = {
    sort: {
      petId: 1,
    },
  };
  if (petsId) {
    query.petId = {
      $in: petsId,
    };
  }
  if (page !== undefined && limit) {
    options.skip = page * limit;
    options.limit = limit;
  }
  return dbUserPet.find(query, null, options);
};

interface ICalcTotalPets {
  userId: string;
}

export const calcTotalPets = async ({userId}: ICalcTotalPets) => {
  return dbUserPet.countDocuments({
    userId,
  });
};

interface ICreateUserPet {
  userId: string;
  pet: IUserPet;
}

export const createUserPet = async ({userId, pet}: ICreateUserPet) => {
  return dbUserPet.findOneAndUpdate(
    {
      userId,
      petId: pet.petId,
    },
    {
      $set: pet,
    },
    {
      upsert: true,
    }
  );
};

interface IUpdateUserPet {
  userId: string;
  pet: IUserPet;
}

export const updateUserPet = async ({userId, pet}: IUpdateUserPet) => {
  return dbUserPet.findOneAndUpdate(
    {
      userId,
      petId: pet.petId,
    },
    {
      $set: pet,
    }
  );
};

interface IDeleteExtraPets {
  userId: string;
  maxPetId: number;
}

export const deleteExtraPets = async ({userId, maxPetId}: IDeleteExtraPets) => {
  return dbUserPet.deleteMany({
    userId,
    petId: {
      $gt: maxPetId,
    },
  });
};

interface IGetUserReadyPets {
  userId: string;
}

export const getUserReadyPets = async ({userId}: IGetUserReadyPets) => {
  return dbUserPet.find({
    userId,
    readyAt: {
      $lte: new Date(),
    },
  });
};

interface IUpdateRemindedPets {
  userId: string;
  petIds: number[];
}

export const updateRemindedPets = async ({userId, petIds}: IUpdateRemindedPets) => {
  return dbUserPet.updateMany(
    {
      userId,
      petId: {
        $in: petIds,
      },
    },
    {
      $unset: {
        readyAt: 1,
      },
      $set: {
        status: RPG_PET_STATUS.back,
      },
    }
  );
};

interface IGetAvailableEpicPets {
  userId: string;
}

export const getAvailableEpicPets = async ({userId}: IGetAvailableEpicPets) => {
  return dbUserPet.find({
    userId,
    status: RPG_PET_STATUS.idle,
    'skills.epic': {
      $ne: null,
    },
  });
};

export const claimAllPets = async ({userId}: {userId: string}) => {
  return dbUserPet.updateMany(
    {
      userId,
      $or: [
        {
          status: RPG_PET_STATUS.back,
        },
        {
          readyAt: {
            $lte: new Date(),
          },
        },
      ],
    },
    {
      $set: {
        status: RPG_PET_STATUS.idle,
      },
      $unset: {
        readyAt: 1,
      },
    }
  );
};
