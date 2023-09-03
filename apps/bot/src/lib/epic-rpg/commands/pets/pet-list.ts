import {Client, Embed, Message, User} from 'discord.js';
import ms from 'ms';
import embedReaders from '../../embed-readers';
import {userPetServices} from '../../../../services/database/user-pet.service';
import {RPG_PET_SKILL} from '@epic-helper/constants';
import {IUserPet} from '@epic-helper/models';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {createMessageEditedListener} from '../../../../utils/message-edited-listener';

interface IRpgPet {
  client: Client;
  author: User;
  message: Message;
  isSlashCommand: boolean;
}

export const rpgPetList = async ({message, author, isSlashCommand, client}: IRpgPet) => {
  if (!message.inGuild()) return;
  const event = createRpgCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed, collected) => {
    if (isRpgPet({author, embed})) {
      await rpgPetSuccess({client, author, embed, message: collected});
      event.stop();
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IRpgPetSuccess {
  client: Client;
  embed: Embed;
  author: User;
  message: Message;
}

const rpgPetSuccess = async ({author, embed, message, client}: IRpgPetSuccess) => {
  await updatePetsFromEmbed({embed, author, client});
  const event = await createMessageEditedListener({
    messageId: message.id,
  });
  if (!event) return;
  event.on('edited', async (newMessage) => {
    if (isRpgPet({author, embed: newMessage.embeds[0]})) {
      await updatePetsFromEmbed({embed: newMessage.embeds[0], author, client});
    }
  });
};

interface IUpdatePetsFromEmbed {
  embed: Embed;
  author: User;
  client: Client;
}

const updatePetsFromEmbed = async ({embed, author}: IUpdatePetsFromEmbed) => {
  const pets = embedReaders.pets({embed, author});
  const dbPetsList = await userPetServices.getUserPets({
    userId: author.id,
    petsId: pets.map((pet) => pet.petId),
  });
  for (const newPet of pets) {
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
