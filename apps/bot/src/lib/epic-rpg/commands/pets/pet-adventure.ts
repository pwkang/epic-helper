import {IMessageContentChecker} from '../../../../types/utils';
import {BaseMessageOptions, Message, User} from 'discord.js';
import {userPetServices} from '../../../../models/user-pet/user-pet.service';
import {IUserPet} from '../../../../models/user-pet/user-pet.type';
import {RPG_PET_STATUS, RPG_PET_TYPE} from '../../../../constants/epic-rpg/pet';
import ms from 'ms';
import convertMsToHumanReadableString from '../../../../utils/convert-ms-to-human-readable-string';
import {convertNumToPetId, convertPetIdToNum} from '@epic-helper/utils';

/*
 *  ===================================================
 *       Main function to send pet to adventure
 *  ===================================================
 */

interface IRpgPetAdventure {
  author: User;
  selectedPets: string[];
  amountOfPetSent: number;
  message: Message;
}

interface ISentResult {
  petId: number;
  duration: number;
}

export const rpgPetAdventure = async ({
  author,
  selectedPets,
  amountOfPetSent,
  message,
}: IRpgPetAdventure): Promise<BaseMessageOptions> => {
  let petsToSend = await fetchPetsToSend({
    userId: author.id,
    selectedPets: selectedPets,
  });
  const sentResult: ISentResult[] = [];

  if (amountOfPetSent !== petsToSend.length) {
    return {
      content:
        `**${amountOfPetSent}** pets were sent to adventure, but found **${petsToSend.length}** available pets to send.\n` +
        `Type \`rpg pet\` to update and register pet reminder or use \`rpg pet summary\` to register 1 pet reminder`,
    };
  }

  if (petsToSend.length === 1 && isPetComebackInstantly({message, author})) {
    sentResult.push({
      petId: petsToSend[0].petId,
      duration: 0,
    });
    await updateInstantBackPet({
      userId: author.id,
      pet: petsToSend[0],
    });
    petsToSend = [];
  }

  if (hasPetsReturnedInstantly(message.content)) {
    const returnedPets = extractReturnedPetsId({
      message,
      author,
    });
    for (const petId of returnedPets) {
      sentResult.push({
        petId: convertPetIdToNum(petId),
        duration: 0,
      });
      const pet = petsToSend.find((p) => p.petId === convertPetIdToNum(petId));
      if (pet) {
        await updateInstantBackPet({
          userId: author.id,
          pet,
        });
      }
    }
    petsToSend = petsToSend.filter((p) => !returnedPets.map(convertPetIdToNum).includes(p.petId));
  }

  for (const pet of petsToSend) {
    const duration = await sendPetToAdventure({
      userId: author.id,
      pet,
    });
    sentResult.push({
      petId: pet.petId,
      duration,
    });
  }

  return {
    content: generateResult(sentResult),
  };
};

/**
 *  ===================================================
 *    Iterates through each pet id selected by user
 *             and fetch it from database
 *  ===================================================
 */

interface IFetchPetsToSend {
  userId: string;
  selectedPets: string[];
}

const fetchPetsToSend = async ({selectedPets, userId}: IFetchPetsToSend) => {
  const nonEpicPetsId = selectedPets.filter((p) => p !== 'epic');
  const petsToSend = [];
  if (!!nonEpicPetsId.length) {
    const nonEpicPets = await userPetServices.getUserPets({
      userId,
      petsId: nonEpicPetsId.map(convertPetIdToNum),
    });
    petsToSend.push(...nonEpicPets);
  }
  if (hasSentEpic(selectedPets)) {
    const availableEpicPets = await userPetServices.getAvailableEpicPets({
      userId,
    });
    petsToSend.push(...availableEpicPets);
  }
  return petsToSend.filter((p) => p.status === RPG_PET_STATUS.idle);
};

/*
 *  ===================================================
 *        Check whether the message is valid
 *  ===================================================
 */

const isSuccessfullySentPetsToAdventure = ({message, author}: IMessageContentChecker) =>
  isSentSinglePetToAdventure({message, author}) ||
  isSentMultiplePetsToAdventure({
    message,
    author,
  });

const isSentSinglePetToAdventure = ({message, author}: IMessageContentChecker) =>
  message.content.includes('will be back in') ||
  isPetComebackInstantly({
    message,
    author,
  });

const isSentMultiplePetsToAdventure = ({message}: IMessageContentChecker) =>
  message.content.includes('of your pets have started an adventure!');

const isPetComebackInstantly = ({message}: IMessageContentChecker) =>
  message.content.includes('IT CAME BACK INSTANTLY!!');

/*
 *  ===================================================
 *       Check if the pet commands is fail
 *  ===================================================
 */

const isFailToSendPetsToAdventure = ({message, author}: IMessageContentChecker) =>
  isNoAvailablePetToSend({message, author}) ||
  isSendingMultipleNonEpicPets({message, author}) ||
  isSelectedPetsInAdventure({message, author}) ||
  isSelectingInvalidPets({message, author}) ||
  isNoPetMeetRequirement({message, author}) ||
  isSelectingPetsMultipleTimes({message, author});

const isNoAvailablePetToSend = ({message, author}: IMessageContentChecker) =>
  message.content.includes('you cannot send another pet to an adventure') &&
  message.mentions.has(author.id);

const isSendingMultipleNonEpicPets = ({message, author}: IMessageContentChecker) =>
  message.content.includes('you cannot send more than one pet') && message.mentions.has(author.id);

const isSelectedPetsInAdventure = ({message, author}: IMessageContentChecker) =>
  message.content.includes('is already in an adventure!') && message.mentions.has(author.id);

const isSelectingInvalidPets = ({message, author}: IMessageContentChecker) =>
  message.content.includes('what pets are you trying to select?') &&
  message.mentions.has(author.id);

const isNoPetMeetRequirement = ({message, author}: IMessageContentChecker) =>
  message.content.includes('no pets met the requirement') && message.mentions.has(author.id);

const isSelectingPetsMultipleTimes = ({message, author}: IMessageContentChecker) =>
  message.content.includes('has been selected more than once') && message.mentions.has(author.id);

/*
 *  ================================================================
 *    Read and return total pets sent to adventure from rpg message
 *  ================================================================
 */

const amountOfPetsSentToAdventure = ({message, author}: IMessageContentChecker) => {
  if (isSentSinglePetToAdventure({message, author})) return 1;
  if (isSentMultiplePetsToAdventure({message, author})) {
    const amount = message.content.match(/\*\*(\d+)\*\* of your pets have started an adventure!/);
    if (amount) return parseInt(amount[1]);
  }
  return 1;
};

/*
 *  ===================================================
 *      Check whether the pet id contains epic
 *  ===================================================
 */

const hasSentEpic = (pets: string[]) => pets.map((p) => p.toLowerCase()).includes('epic');

interface ISendPetToAdventure {
  userId: string;
  pet: IUserPet;
}

/*
 *  ===================================================
 *     Send pet to adventure and update database
 * ===================================================
 */

const sendPetToAdventure = async ({pet, userId}: ISendPetToAdventure) => {
  const adventureTime = calcAdventureTime({pet});
  pet.status = RPG_PET_STATUS.adventure;
  pet.readyAt = new Date(Date.now() + adventureTime);
  await userPetServices.updateUserPet({
    pet,
    userId,
  });
  return adventureTime;
};

/*
 *  ===================================================
 *       Update pet status to back from adventure
 *  ===================================================
 */

interface IUpdatePetStatus {
  userId: string;
  pet: IUserPet;
}

const updateInstantBackPet = async ({pet, userId}: IUpdatePetStatus) => {
  pet.status = RPG_PET_STATUS.back;
  pet.readyAt = new Date();
  await userPetServices.updateUserPet({
    pet,
    userId,
  });
};

/*
 *  ===================================================
 *     Calculate adventure time based on pet skills
 *  ===================================================
 */

interface ICalcAdventureTime {
  pet: IUserPet;
}

const BASE_ADVENTURE_TIME = ms('4h');
const REDUCE_TIME_PER_FAST_SKILL = ms('9m') + ms('36s');

const calcAdventureTime = ({pet}: ICalcAdventureTime) => {
  const fastSkillTier = pet.skills.fast ?? 0;
  const isGoldenBunny = pet.name === RPG_PET_TYPE.goldenBunny ? 2 : 1;
  return BASE_ADVENTURE_TIME - fastSkillTier * REDUCE_TIME_PER_FAST_SKILL * isGoldenBunny;
};

/*
 *  ===================================================
 *                 Send Result Message
 *  ===================================================
 */

const generateResult = (result: ISentResult[]) => {
  const results: string[] = ['Reminding the following pets:'];
  for (let r of result) {
    const petId = convertNumToPetId(r.petId).toUpperCase();
    const duration = r.duration ? convertMsToHumanReadableString(r.duration) : '**Ready To Claim**';
    results.push(`\`ID: ${petId}\` - ${duration}`);
  }
  return results.join('\n');
};

/**
 * ===================================================
 *   Extract returned pet id from rpg message content
 * ===================================================
 */

const hasPetsReturnedInstantly = (content: string) =>
  content.includes('the following pets are back instantly:');

const extractReturnedPetsId = ({message}: IMessageContentChecker) => {
  if (!hasPetsReturnedInstantly(message.content)) return [];
  const targetRow = message.content.split('\n').find(hasPetsReturnedInstantly) ?? '';
  const petIds = targetRow.match(/`(\w+)`/g);
  if (!petIds) return [];
  return petIds.map((p) => p.replace(/`/g, ''));
};

export const rpgPetAdventureChecker = {
  isSuccessfullySentPetsToAdventure,
  isFailToSendPetsToAdventure,
  amountOfPetsSentToAdventure,
};
