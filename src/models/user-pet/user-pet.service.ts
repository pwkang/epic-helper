import {mongoClient} from '../../services/mongoose/mongoose.service';
import {IUserPet} from './user-pet.type';
import userPetSchema from './user-pet.schema';

const dbUserPet = mongoClient.model<IUserPet>('user-pet', userPetSchema);

interface IGetUserPets {
  userId: string;
  petsId?: number[];
}

export const getUserPets = async ({userId, petsId}: IGetUserPets) => {
  const query: any = {
    userId,
  };
  if (petsId) {
    query.petId = {
      $in: petsId,
    };
  }
  return dbUserPet.find(query, null, {
    sort: {
      petId: 1,
    },
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
