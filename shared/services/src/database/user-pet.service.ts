import {RPG_PET_ADV_STATUS} from '@epic-helper/constants';
import type {IUser} from '@epic-helper/models';
import {type IUserPet} from '@epic-helper/models';
import 'mongodb';
import type {ValuesOf} from '@epic-helper/types';
import {userService} from './user.service';
import {userReminderServices} from './user-reminder.service';

const saveUser = async (user: IUser) => {
  user.rpgInfo.pets = user.rpgInfo.pets.sort((a, b) => a.petId - b.petId);
  await userService.saveUserPets({
    userId: user.userId,
    pets: user.rpgInfo.pets,
  });

  const nextReminderTime = user.rpgInfo.pets
    .filter(pet => pet.readyAt)
    .sort((a, b) =>
      (a.readyAt?.getTime() ?? 0) - (b.readyAt?.getTime() ?? 0),
    )[0]?.readyAt;

  if (!nextReminderTime) {
    await userReminderServices.updateRemindedCooldowns({
      userId: user.userId,
      types: ['pet'],
    });
  } else {
    await userReminderServices.saveUserPetCooldown({
      userId: user.userId,
      readyAt: nextReminderTime,
    });
  }
};

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
  orderBy = 'petId',
}: IGetUserPets) => {
  const user = await userService.getUserAccount(userId);
  if (!user) return [];
  let pets = user.rpgInfo.pets;

  if (orderBy === 'petId') {
    pets = pets.sort((a, b) => a.petId - b.petId);
  } else if (orderBy === 'readyAt') {
    pets = pets.sort((a, b) => {
      if (!a.readyAt || !b.readyAt) return 0;
      return a.readyAt.getTime() - b.readyAt.getTime();
    });
  }

  if (petsId) {
    pets = pets.filter(pet => petsId.includes(pet.petId));
  }

  if (status) {
    pets = pets.filter(pet => status.includes(pet.status));
  }

  if (page !== undefined && limit !== undefined) {
    pets = pets.slice(page * limit, (page + 1) * limit);
  }

  return pets;
};

interface ICalcTotalPets {
  userId: string;
  status?: ValuesOf<typeof RPG_PET_ADV_STATUS>[];
}

const calcTotalPets = async ({userId, status}: ICalcTotalPets) => {
  const user = await userService.getUserAccount(userId);
  if (!user) return 0;
  let pets = user.rpgInfo.pets;

  if (status) {
    pets = pets.filter(pet => status.includes(pet.status));
  }

  return pets.length;
};

interface ICreateUserPet {
  userId: string;
  pet: IUserPet;
}

const createUserPet = async ({userId, pet}: ICreateUserPet) => {
  const user = await userService.getUserAccount(userId);
  if (!user) return [];
  user.rpgInfo.pets.push(pet);
  await saveUser(user);
  return user.rpgInfo.pets;
};

interface IUpdateUserPet {
  userId: string;
  pet: IUserPet;
}

const updateUserPet = async ({userId, pet}: IUpdateUserPet) => {
  const user = await userService.getUserAccount(userId);
  if (!user) return [];
  const petIndex = user.rpgInfo.pets.findIndex(p => p.petId === pet.petId);
  if (petIndex === -1) return [];
  user.rpgInfo.pets[petIndex] = pet;
  await saveUser(user);
  return user.rpgInfo.pets;
};

interface IDeleteExtraPets {
  userId: string;
  maxPetId: number;
}

const deleteExtraPets = async ({userId, maxPetId}: IDeleteExtraPets) => {
  const user = await userService.getUserAccount(userId);
  if (!user) return [];
  user.rpgInfo.pets = user.rpgInfo.pets.filter(pet => pet.petId <= maxPetId);
  await saveUser(user);
  return user.rpgInfo.pets;
};

interface IGetUserReadyPets {
  userId: string;
}

const getUserReadyPets = async ({userId}: IGetUserReadyPets) => {
  const user = await userService.getUserAccount(userId);
  if (!user) return [];
  return user.rpgInfo.pets.filter(pet => pet.readyAt && pet.readyAt.getTime() <= new Date().getTime());
};

interface IUpdateRemindedPets {
  userId: string;
  petIds: number[];
}

const updateRemindedPets = async ({userId, petIds}: IUpdateRemindedPets) => {
  const user = await userService.getUserAccount(userId);
  if (!user) return null;
  user.rpgInfo.pets = user.rpgInfo.pets.map(pet => {
    if (petIds.includes(pet.petId)) {
      pet.readyAt = null;
      pet.status = RPG_PET_ADV_STATUS.back;
    }
    return pet;
  });
  await saveUser(user);
  return user.rpgInfo.pets;
};

interface IGetAvailableEpicPets {
  userId: string;
}

const getAvailableEpicPets = async ({userId}: IGetAvailableEpicPets) => {
  const user = await userService.getUserAccount(userId);
  if (!user) return [];
  return user.rpgInfo.pets.filter(pet => pet.status === RPG_PET_ADV_STATUS.idle && pet.skills.epic);
};

interface IGetAdventureEpicPets {
  userId: string;
}

const getAdventureEpicPets = async ({userId}: IGetAdventureEpicPets) => {
  const user = await userService.getUserAccount(userId);
  if (!user) return [];
  return user.rpgInfo.pets.filter(pet => pet.status === RPG_PET_ADV_STATUS.adventure && pet.skills.epic);
};

const claimAllPets = async ({userId}: {userId: string}) => {
  const user = await userService.getUserAccount(userId);
  if (!user) return null;
  user.rpgInfo.pets = user.rpgInfo.pets.map(pet => {
    if (pet.status === RPG_PET_ADV_STATUS.back || (pet.readyAt && pet.readyAt.getTime() <= new Date().getTime())) {
      pet.status = RPG_PET_ADV_STATUS.idle;
      pet.readyAt = null;
    }
    return pet;
  });
  await saveUser(user);
  return user.rpgInfo.pets;
};

const resetUserPetsAdvStatus = async (userId: string) => {
  const user = await userService.getUserAccount(userId);
  if (!user) return null;
  user.rpgInfo.pets = user.rpgInfo.pets.map(pet => {
    pet.status = RPG_PET_ADV_STATUS.idle;
    pet.readyAt = null;
    return pet;
  });
  await saveUser(user);
  return user.rpgInfo.pets;
};

interface ICancelAdventurePets {
  userId: string;
  petIds: number[];
}

const cancelAdventurePets = async ({userId, petIds}: ICancelAdventurePets) => {
  const user = await userService.getUserAccount(userId);
  if (!user) return null;
  user.rpgInfo.pets = user.rpgInfo.pets.map(pet => {
    if (petIds.includes(pet.petId)) {
      pet.status = RPG_PET_ADV_STATUS.idle;
      pet.readyAt = null;
    }
    return pet;
  });
  await saveUser(user);
  return user.rpgInfo.pets;
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
  cancelAdventurePets,
};
