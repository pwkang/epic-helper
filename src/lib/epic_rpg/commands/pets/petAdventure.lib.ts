import {IMessageContentChecker} from '../../../../types/utils';
import {MessagePayloadOption, User} from 'discord.js';
import {
  getAvailableEpicPets,
  getUserPets,
  updateUserPet,
} from '../../../../models/user-pet/user-pet.service';
import {convertPetIdToNum} from '../../../../utils/epic_rpg/pet/petIdConversion';
import {IUserPet} from '../../../../models/user-pet/user-pet.type';
import {RPG_PET_STATUS, RPG_PET_TYPE} from '../../../../constants/pet';
import ms from 'ms';

interface IRpgPetAdventure {
  author: User;
  selectedPets: string[];
  amountOfPetSent: number;
}

export const rpgPetAdventure = async ({
  author,
  selectedPets,
  amountOfPetSent,
}: IRpgPetAdventure): Promise<MessagePayloadOption | void> => {
  const petsToSend = await fetchPetsToSend({
    userId: author.id,
    selectedPets: selectedPets,
  });

  if (amountOfPetSent !== petsToSend.length) {
    return {
      content:
        `**${amountOfPetSent}** pets were sent to adventure, but found **${petsToSend.length}** available pets to send.\n` +
        `Type \`rpg pet\` to update and register pet reminder or use \`rpg pet summary\` to register 1 pet reminder`,
    };
  }

  petsToSend.forEach((pet) => {
    sendPetToAdventure({
      userId: author.id,
      pet,
    });
  });
};

interface IFetchPetsToSend {
  userId: string;
  selectedPets: string[];
}

const fetchPetsToSend = async ({selectedPets, userId}: IFetchPetsToSend) => {
  const nonEpicPetsId = selectedPets.filter((p) => p !== 'epic');
  const petsToSend = [];
  if (!!nonEpicPetsId.length) {
    const nonEpicPets = await getUserPets({
      userId,
      petsId: nonEpicPetsId.map(convertPetIdToNum),
    });
    petsToSend.push(...nonEpicPets);
  }
  if (hasSentEpic(selectedPets)) {
    const availableEpicPets = await getAvailableEpicPets({
      userId,
    });
    petsToSend.push(...availableEpicPets);
  }
  return petsToSend.filter((p) => p.status === RPG_PET_STATUS.idle);
};

export const isSuccessfullySentPetsToAdventure = ({message, author}: IMessageContentChecker) =>
  isSentSinglePetToAdventure({message, author}) || isSentMultiplePetsToAdventure({message, author});

const isSentSinglePetToAdventure = ({message, author}: IMessageContentChecker) =>
  message.content.includes('will be back in');

const isSentMultiplePetsToAdventure = ({message, author}: IMessageContentChecker) =>
  message.content.includes('of your pets have started an adventure!');

export const isFailToSendPetsToAdventure = ({message, author}: IMessageContentChecker) =>
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

export const amountOfPetsSentToAdventure = ({message, author}: IMessageContentChecker) => {
  if (isSentSinglePetToAdventure({message, author})) return 1;
  if (isSentMultiplePetsToAdventure({message, author})) {
    const amount = message.content.match(/\*\*(\d+)\*\* of your pets have started an adventure!/);
    if (amount) return parseInt(amount[1]);
  }
  return 1;
};

const hasSentEpic = (pets: string[]) => pets.map((p) => p.toLowerCase()).includes('epic');

interface ISendPetToAdventure {
  userId: string;
  pet: IUserPet;
}

const sendPetToAdventure = async ({pet, userId}: ISendPetToAdventure) => {
  const adventureTime = calcAdventureTime({pet});
  pet.status = RPG_PET_STATUS.adventure;
  pet.readyAt = new Date(Date.now() + adventureTime);
  await updateUserPet({
    pet,
    userId,
  });
};

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
