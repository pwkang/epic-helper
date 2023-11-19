import type {Client, Embed, Message, User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import ms from 'ms';
import embedReaders from '../../embed-readers';
import {userPetServices} from '../../../../services/database/user-pet.service';
import {
  BOT_COLOR,
  RPG_PET_SKILL_ASCEND,
  RPG_PET_SKILL_SPECIAL,
} from '@epic-helper/constants';
import type {IUserPet} from '@epic-helper/models';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {createMessageEditedListener} from '../../../../utils/message-edited-listener';
import {djsMessageHelper} from '../../../discordjs/message';
import {convertNumToPetId} from '@epic-helper/utils';

interface IRpgPet {
  client: Client;
  author: User;
  message: Message;
  isSlashCommand: boolean;
}

export const rpgPetList = async ({
  message,
  author,
  isSlashCommand,
  client,
}: IRpgPet) => {
  if (!message.inGuild()) return;
  let event = createRpgCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed, collected) => {
    if (isRpgPet({author, embed})) {
      await rpgPetSuccess({client, author, embed, message: collected});
      event?.stop();
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IRpgPetSuccess {
  client: Client;
  embed: Embed;
  author: User;
  message: Message;
}

interface IUpdatedPets {
  newPets: IUserPet[];
  updatedPets: IUserPet[];
}

const rpgPetSuccess = async ({
  author,
  embed,
  message,
  client,
}: IRpgPetSuccess) => {
  const updatedPets: IUpdatedPets = {
    newPets: [],
    updatedPets: [],
  };
  await updatePetsFromEmbed({embed, author, updatedPets});
  let sentMessage = await sendResultEmbed({
    author,
    client,
    channelId: message.channel.id,
    updatedPets,
  });
  const event = await createMessageEditedListener({
    messageId: message.id,
    timeout: ms('3m'),
  });
  if (!event) return;
  event.on(message.id, async (newMessage) => {
    if (isRpgPet({author, embed: newMessage.embeds[0]})) {
      await updatePetsFromEmbed({
        embed: newMessage.embeds[0],
        author,
        updatedPets,
      });

      sentMessage = await sendResultEmbed({
        author,
        message: sentMessage,
        client,
        channelId: message.channel.id,
        updatedPets,
      });
    }
  });
};

interface ISendResultEmbed {
  client: Client;
  message?: Message;
  channelId: string;
  updatedPets: IUpdatedPets;
  author: User;
}

const sendResultEmbed = async ({
  message,
  client,
  channelId,
  updatedPets,
  author,
}: ISendResultEmbed) => {
  if (!updatedPets.newPets.length && !updatedPets.updatedPets.length) return;
  const embed = renderResultEmbed({
    updatedPets,
    author,
  });
  if (message) {
    await djsMessageHelper.edit({
      client,
      message,
      options: {
        embeds: [embed],
      },
    });
    return message;
  }
  return await djsMessageHelper.send({
    client,
    channelId,
    options: {
      embeds: [embed],
    },
  });
};

interface IUpdatePetsFromEmbed {
  embed: Embed;
  author: User;
  updatedPets: IUpdatedPets;
}

const updatePetsFromEmbed = async ({
  embed,
  author,
  updatedPets,
}: IUpdatePetsFromEmbed) => {
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
      updatedPets.newPets.push(newPet);
      continue;
    }
    if (isPetUpdated({newPet, oldPet})) {
      await userPetServices.updateUserPet({
        pet: newPet,
        userId: author.id,
      });
      updatedPets.updatedPets.push(newPet);
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
  const skillNameList = Object.values({
    ...RPG_PET_SKILL_ASCEND,
    ...RPG_PET_SKILL_SPECIAL,
  }) as (
    | keyof typeof RPG_PET_SKILL_ASCEND
    | keyof typeof RPG_PET_SKILL_SPECIAL
  )[];
  const isSkillUpdated = skillNameList.some(
    (skillName) => newPet.skills[skillName] !== oldPet.skills[skillName],
  );
  return (
    isStatusUpdated ||
    isSkillUpdated ||
    isTierUpdated ||
    isReadyAtUpdated ||
    isNameUpdated
  );
};

// ======== Get the maximum pet id from the embed ========

interface IGetMaxPetId {
  embed: Embed;
}

const getMaxPetId = ({embed}: IGetMaxPetId) => {
  const num = embed.description
    ?.split('\n')?.[1]
    ?.split(' ')
    ?.pop()
    ?.split('/')[0];
  return num ? parseInt(num) : 0;
};

interface IRenderResultEmbed {
  updatedPets: IUpdatedPets;
  author: User;
}

const renderResultEmbed = ({updatedPets, author}: IRenderResultEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: `${author.username} — pets`,
    iconURL: author.avatarURL() ?? undefined,
  });
  if (updatedPets.newPets.length) {
    embed.addFields({
      name: 'New pets',
      value: updatedPets.newPets
        .map((pet) => convertNumToPetId(pet.petId))
        .map((id) => `\`${id}\``)
        .join(' ') || '-',
      inline: true,
    });
  }
  if (updatedPets.updatedPets.length) {
    embed.addFields({
      name: 'Updated pets',
      value: updatedPets.updatedPets
        .map((pet) => convertNumToPetId(pet.petId))
        .map((id) => `\`${id}\``)
        .join(' ') || '-',
      inline: true,
    });
  }
  return embed;
};
