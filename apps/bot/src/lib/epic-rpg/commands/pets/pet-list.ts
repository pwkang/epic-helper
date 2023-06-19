import {Embed, User} from 'discord.js';
import ms from 'ms';
import embedReaders from '../../embed-readers';
import {userPetServices} from '@epic-helper/models';

interface IRpgPet {
  embed: Embed;
  author: User;
}

export const rpgPetList = async ({author, embed}: IRpgPet) => {
  const pets = embedReaders.pets({embed, author});
  const dbPetsList = await userPetServices.getUserPets({
    userId: author.id,
    petsId: pets.map((pet) => pet.petId),
  });
  for (let newPet of pets) {
    const oldPet = dbPetsList.find((dbPet) => dbPet.petId === newPet.petId);
    if (!oldPet) {
      await userPetServices.createUserPet({
        pet: newPet,
        userId: author.id,
      });
      continue;
    }
    if (isPetUpdated({newPet, oldPet})) {
      await userPetServices.updateUserPet({
        pet: newPet,
        userId: author.id,
      });
    }
  }
  const maxPet = getMaxPetId({embed});
  await userPetServices.deleteExtraPets({
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

const isRpgPet = ({author, embed}: IIsRpgPet) =>
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

export const rpgPetListChecker = {
  isRpgPet,
};
