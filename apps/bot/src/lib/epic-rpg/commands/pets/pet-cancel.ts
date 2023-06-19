import {BaseMessageOptions, Message, User} from 'discord.js';
import {convertNumToPetId, convertPetIdToNum} from '@epic-helper/utils';
import {IUserPet} from '@epic-helper/models';
import {RPG_PET_STATUS} from '@epic-helper/constants';
import {userPetServices} from '../../../../services/database/user-pet.service';

interface IRpgPetAdvCancel {
  author: User;
  selectedPets: string[];
  amountOfPetCancelled: number;
  message: Message;
}

export const rpgPetAdvCancel = async ({
  author,
  selectedPets,
  amountOfPetCancelled,
}: IRpgPetAdvCancel): Promise<BaseMessageOptions> => {
  const petsToCancel = await fetchPetsToCancel({
    userId: author.id,
    selectedPets,
  });

  if (petsToCancel.length !== amountOfPetCancelled) {
    return {
      content: `**${amountOfPetCancelled}** pets were cancelled, but found **${petsToCancel.length}** available pets to cancel.`,
    };
  }

  await userPetServices.cancelAdventurePets({
    petIds: petsToCancel.map((p) => p.petId),
    userId: author.id,
  });

  return {
    content: `**${petsToCancel.length}** adventure(s) cancelled (\`${petsToCancel
      .map((p) => convertNumToPetId(p.petId).toUpperCase())
      .join(' ')}\`)`,
  };
};

interface IIsPetSuccessfullyCancelled {
  message: Message;
  author: User;
}

const isPetSuccessfullyCancelled = ({message, author}: IIsPetSuccessfullyCancelled): boolean =>
  message.mentions.has(author.id) && message.content.includes('pet adventure(s) cancelled');

interface IExtractCancelledPetAmount {
  message: Message;
}

const extractCancelledPetAmount = ({message}: IExtractCancelledPetAmount) => {
  const amount = message.content.match(/\*\*(\d+)\*\* pet adventure\(s\) cancelled/)?.[1];
  return amount ? parseInt(amount) : 0;
};

/**
 *  ===================================================
 *    Iterates through each pet id selected by user
 *             and fetch it from database
 *  ===================================================
 */

interface IFetchPetsToCancel {
  userId: string;
  selectedPets: string[];
}

const fetchPetsToCancel = async ({selectedPets, userId}: IFetchPetsToCancel) => {
  const nonEpicPetsId = selectedPets.filter((p) => p !== 'epic');
  const petsToCancel: IUserPet[] = [];
  if (hasCancelEpic(selectedPets)) {
    const availableEpicPets = await userPetServices.getAdventureEpicPets({
      userId,
    });
    petsToCancel.push(...availableEpicPets);
  }
  if (!!nonEpicPetsId.length) {
    const nonEpicPets = await userPetServices.getUserPets({
      userId,
      petsId: nonEpicPetsId
        .map(convertPetIdToNum)
        .filter((p) => petsToCancel.every((p2) => p2.petId !== p)),
      status: [RPG_PET_STATUS.adventure],
    });
    petsToCancel.push(...nonEpicPets);
  }
  return petsToCancel.filter((p) => p.status !== RPG_PET_STATUS.idle);
};

const hasCancelEpic = (pets: string[]) => pets.map((p) => p.toLowerCase()).includes('epic');

/**
 *  ===================================================
 *        List of checker here
 *   ===================================================
 */

interface IChecker {
  message: Message;
  author: User;
}

const isFailToCancelPet = ({message, author}: IChecker): boolean =>
  isPetNotOnAdventure({message, author}) ||
  isNoPetMeetRequirement({message, author}) ||
  isInvalidCancelPetId({message, author}) ||
  isPetSelectedMultipleTimes({message, author}) ||
  isSelectedPetHasTimeTraveller({message, author});

const isPetSelectedMultipleTimes = ({message, author}: IChecker): boolean =>
  message.mentions.has(author.id) && message.content.includes('has been selected more than once');

const isInvalidCancelPetId = ({message, author}: IChecker): boolean =>
  message.mentions.has(author.id) &&
  message.content.includes('what pet(s) are you trying to select?');

const isPetNotOnAdventure = ({message, author}: IChecker): boolean =>
  message.mentions.has(author.id) && message.content.includes('is not in an adventure');

const isNoPetMeetRequirement = ({message, author}: IChecker): boolean =>
  message.mentions.has(author.id) && message.content.includes('no pets met the requirement');

const isSelectedPetHasTimeTraveller = ({message, author}: IChecker): boolean =>
  message.mentions.has(author.id) &&
  message.content.includes('you cannot cancel the adventure of your pet');

export const rpgPetCancelChecker = {
  isFailToCancelPet,
  extractCancelledPetAmount,
  isPetSuccessfullyCancelled,
};
