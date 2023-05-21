import {Embed, User} from 'discord.js';
import {readPets} from '../../../utils/epic_rpg/pet/readPets';
import {
  createUserPet,
  deleteExtraPets,
  getUserPets,
  updateUserPet,
} from '../../../models/user-pet/user-pet.service';
import {IUserPet} from '../../../models/user-pet/user-pet.type';
import {RPG_PET_SKILL} from '../../../constants/pet';
import ms from 'ms';

interface IRpgPet {
  embed: Embed;
  author: User;
}

export const rpgPet = async ({author, embed}: IRpgPet) => {
  const pets = readPets({embed, author});
  const dbPetsList = await getUserPets({
    userId: author.id,
    petsId: pets.map((pet) => pet.petId),
  });
  for (let newPet of pets) {
    const oldPet = dbPetsList.find((dbPet) => dbPet.petId === newPet.petId);
    if (!oldPet) {
      await createUserPet({
        pet: newPet,
        userId: author.id,
      });
      continue;
    }
    if (isPetUpdated({newPet, oldPet})) {
      await updateUserPet({
        pet: newPet,
        userId: author.id,
      });
    }
  }
  const maxPet = getMaxPetId({embed});
  await deleteExtraPets({
    userId: author.id,
    maxPetId: maxPet,
  });
};

/**
 *
 *  =============================
 *       List of Checker here
 *  =============================
 *
 */
interface IIsRpgPet {
  embed: Embed;
  author: User;
}

export const isRpgPet = ({author, embed}: IIsRpgPet) =>
  embed.author?.name === `${author.username} — pets` &&
  embed.description?.includes('Pets can collect items and coins');

// ======== Check if pet is updated ========

interface IIsPetUpdated {
  newPet: IUserPet;
  oldPet: IUserPet;
}

const isPetUpdated = ({newPet, oldPet}: IIsPetUpdated) => {
  const isNameUpdated = newPet.name !== oldPet.name;
  const isTierUpdated = newPet.tier !== oldPet.tier;
  const oldPetReadyAt = oldPet.readyAt?.getTime() ?? 0;
  const newPetReadyAt = newPet.readyAt?.getTime() ?? 0;
  const isReadyAtUpdated = Math.abs(newPetReadyAt - oldPetReadyAt) > ms('5s');
  const isStatusUpdated = newPet.status !== oldPet.status;
  const skillNameList = Object.keys(RPG_PET_SKILL) as Array<keyof typeof RPG_PET_SKILL>;
  const isSkillUpdated = skillNameList.some(
    (skillName) => newPet.skills[skillName] !== oldPet.skills[skillName]
  );
  return isStatusUpdated || isSkillUpdated || isTierUpdated || isReadyAtUpdated || isNameUpdated;
};

// ======== Get the maximum pet id from the embed ========

interface IGetMaxPetId {
  embed: Embed;
}

const getMaxPetId = ({embed}: IGetMaxPetId) => {
  const num = embed.description?.split('\n')?.[1]?.split(' ')?.pop()?.split('/')[0];
  return num ? parseInt(num) : 0;
};
