import type {BaseMessageOptions, Client, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import type {IMessageContentChecker} from '../../../../types/utils';
import ms from 'ms';
import {djsMessageHelper} from '../../../discordjs/message';
import {convertNumToPetId, convertPetIdToNum} from '@epic-helper/utils';
import {userPetServices} from '../../../../services/database/user-pet.service';
import {RPG_PET_ADV_STATUS, RPG_PET_TYPE} from '@epic-helper/constants';
import type {IUserPet} from '@epic-helper/models';
import convertMsToHumanReadableString from '../../../../utils/convert-ms-to-human-readable-string';
import {collectSelectedPets} from './_shared';
import {rpgPetAdvCancelSuccess} from './pet-cancel';
import toggleUserChecker from '../../../epic-helper/toggle-checker/user';

interface IRpgPetAdventure {
  client: Client;
  author: User;
  message: Message<true>;
  isSlashCommand: boolean;
  selectedPets?: string[];
}

export const rpgPetAdventure = async ({
  message,
  author,
  client,
  isSlashCommand,
  selectedPets,
}: IRpgPetAdventure) => {
  let event = createRpgCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('content', async (content, collected) => {
    if (
      isFailToSendPetsToAdventure({message: collected, author}) ||
      isFailToCancelPet({message: collected, author})
    )
      event?.stop();
    if (isSuccessfullySentPetsToAdventure({message: collected, author})) {
      event?.stop();
      await rpgPetAdventureSuccess({
        message: collected,
        selectedPets,
        client,
        author,
      });
    }
    if (isPetSuccessfullyCancelled({message: collected, author})) {
      event?.stop();
      await rpgPetAdvCancelSuccess({
        client,
        selectedPets,
        message: collected,
        author,
      });
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IRpgPetAdventureSuccess {
  message: Message<true>;
  selectedPets?: string[];
  author: User;
  client: Client;
}

const rpgPetAdventureSuccess = async ({
  message,
  selectedPets,
  author,
  client,
}: IRpgPetAdventureSuccess) => {
  const toggleUser = await toggleUserChecker({
    userId: author.id,
    client,
    serverId: message.guild.id,
  });
  if (!toggleUser?.reminder.pet) return;
  const amountOfPetSent = extractSentPets({message, author: message.author});

  if (!selectedPets) {
    selectedPets = await collectSelectedPets({
      author,
      client,
      message,
    });
  }

  if (!selectedPets) return;

  const messageOptions = await registerPetsToAdventure({
    message,
    author,
    selectedPets,
    amountOfPetSent,
  });
  await djsMessageHelper.send({
    client,
    channelId: message.channel.id,
    options: messageOptions,
  });
};

interface IRegisterPetsToAdventure {
  author: User;
  selectedPets: string[];
  amountOfPetSent: number;
  message: Message;
}

interface ISentResult {
  petId: number;
  duration: number;
}

export const registerPetsToAdventure = async ({
  author,
  selectedPets,
  amountOfPetSent,
  message,
}: IRegisterPetsToAdventure): Promise<BaseMessageOptions> => {
  let petsToSend = await fetchPetsToSend({
    userId: author.id,
    selectedPets: selectedPets,
  });
  const sentResult: ISentResult[] = [];

  if (amountOfPetSent !== petsToSend.length) {
    return {
      content:
        `**${amountOfPetSent}** pets were sent to adventure, but found **${petsToSend.length}** available pets to send.\n` +
        'Type `rpg pet` to update and register pet reminder or use `rpg pet summary` to register 1 pet reminder',
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
    petsToSend = petsToSend.filter(
      (p) => !returnedPets.map(convertPetIdToNum).includes(p.petId),
    );
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
  if (nonEpicPetsId.length) {
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
  return petsToSend.filter((p) => p.status === RPG_PET_ADV_STATUS.idle);
};

/*
 *  ===================================================
 *      Check whether the pet id contains epic
 *  ===================================================
 */

const hasSentEpic = (pets: string[]) =>
  pets.map((p) => p.toLowerCase()).includes('epic');

/*
 *  ===================================================
 *     Send pet to adventure and update database
 * ===================================================
 */

interface ISendPetToAdventure {
  userId: string;
  pet: IUserPet;
}

const sendPetToAdventure = async ({pet, userId}: ISendPetToAdventure) => {
  const adventureTime = calcAdventureTime({pet});
  pet.status = RPG_PET_ADV_STATUS.adventure;
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
  pet.status = RPG_PET_ADV_STATUS.back;
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
  return (
    BASE_ADVENTURE_TIME -
    fastSkillTier * REDUCE_TIME_PER_FAST_SKILL * isGoldenBunny
  );
};

/*
 *  ===================================================
 *                 Send Result Message
 *  ===================================================
 */

const generateResult = (result: ISentResult[]) => {
  const results: string[] = ['Reminding the following pets:'];
  for (const r of result) {
    const petId = convertNumToPetId(r.petId);
    const duration = r.duration
      ? convertMsToHumanReadableString(r.duration)
      : '**Ready To Claim**';
    results.push(`\`ID: ${petId}\` - ${duration}`);
  }
  return results.join('\n');
};

/*
 *  ===================================================
 *       Check if the pet commands is fail
 *  ===================================================
 */

const isFailToSendPetsToAdventure = ({
  message,
  author,
}: IMessageContentChecker) =>
  isNoAvailablePetToSend({message, author}) ||
  isSendingMultipleNonEpicPets({message, author}) ||
  isSelectedPetsInAdventure({message, author}) ||
  isSelectingInvalidPets({message, author}) ||
  isNoPetMeetRequirement({message, author}) ||
  isSelectingPetsMultipleTimes({message, author});

const isNoAvailablePetToSend = ({message, author}: IMessageContentChecker) =>
  message.content.includes('you cannot send another pet to an adventure') &&
  message.mentions.has(author.id);

const isSendingMultipleNonEpicPets = ({
  message,
  author,
}: IMessageContentChecker) =>
  message.content.includes('you cannot send more than one pet') &&
  message.mentions.has(author.id);

const isSelectedPetsInAdventure = ({message, author}: IMessageContentChecker) =>
  message.content.includes('is already in an adventure!') &&
  message.mentions.has(author.id);

const isSelectingInvalidPets = ({message, author}: IMessageContentChecker) =>
  message.content.includes('what pets are you trying to select?') &&
  message.mentions.has(author.id);

const isSelectingPetsMultipleTimes = ({
  message,
  author,
}: IMessageContentChecker) =>
  message.content.includes('has been selected more than once') &&
  message.mentions.has(author.id);

/*
 *  ===================================================
 *        Check whether the message is valid
 *  ===================================================
 */

const isSuccessfullySentPetsToAdventure = ({
  message,
  author,
}: IMessageContentChecker) =>
  isSentSinglePetToAdventure({message, author}) ||
  isSentMultiplePetsToAdventure({
    message,
    author,
  });

const isSentSinglePetToAdventure = ({
  message,
  author,
}: IMessageContentChecker) =>
  message.content.includes('will be back in') ||
  isPetComebackInstantly({
    message,
    author,
  });

const isSentMultiplePetsToAdventure = ({message}: IMessageContentChecker) =>
  message.content.includes('of your pets have started an adventure!');

const isPetComebackInstantly = ({message}: IMessageContentChecker) =>
  message.content.includes('IT CAME BACK INSTANTLY!!');

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
  message.mentions.has(author.id) &&
  message.content.includes('has been selected more than once');

const isInvalidCancelPetId = ({message, author}: IChecker): boolean =>
  message.mentions.has(author.id) &&
  message.content.includes('what pet(s) are you trying to select?');

const isPetNotOnAdventure = ({message, author}: IChecker): boolean =>
  message.mentions.has(author.id) &&
  message.content.includes('is not in an adventure');

const isNoPetMeetRequirement = ({message, author}: IChecker): boolean =>
  message.mentions.has(author.id) &&
  message.content.includes('no pets met the requirement');

const isSelectedPetHasTimeTraveller = ({message, author}: IChecker): boolean =>
  message.mentions.has(author.id) &&
  message.content.includes('you cannot cancel the adventure of your pet');

interface IIsPetSuccessfullyCancelled {
  message: Message;
  author: User;
}

const isPetSuccessfullyCancelled = ({
  message,
  author,
}: IIsPetSuccessfullyCancelled): boolean =>
  message.mentions.has(author.id) &&
  message.content.includes('pet adventure(s) cancelled');

/*
 *  ================================================================
 *    Read and return total pets sent to adventure from rpg message
 *  ================================================================
 */

const extractSentPets = ({message, author}: IMessageContentChecker) => {
  if (isSentSinglePetToAdventure({message, author})) return 1;
  if (isSentMultiplePetsToAdventure({message, author})) {
    const amount = message.content.match(
      /\*\*(\d+)\*\* of your pets have started an adventure!/,
    );
    if (amount) return parseInt(amount[1]);
  }
  return 1;
};

const hasPetsReturnedInstantly = (content: string) =>
  content.includes('the following pets are back instantly:');

const extractReturnedPetsId = ({message}: IMessageContentChecker) => {
  if (!hasPetsReturnedInstantly(message.content)) return [];
  const targetRow =
    message.content.split('\n').find(hasPetsReturnedInstantly) ?? '';
  const petIds = targetRow.match(/`(\w+)`/g);
  if (!petIds) return [];
  return petIds.map((p) => p.replace(/`/g, ''));
};
