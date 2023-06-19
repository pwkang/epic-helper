import {EmbedBuilder, EmbedField, User} from 'discord.js';
import {convertNumToPetId} from '@epic-helper/utils';
import {convertNumberToRoman} from '../../../../utils/roman-conversion';
import timestampHelper from '../../../discord.js/timestamp';
import {IUserPet} from '@epic-helper/models';
import {BOT_COLOR, BOT_EMOJI, RPG_PET_STATUS, RPG_PET_TYPE} from '@epic-helper/constants';
import {userPetServices} from '../../../../services/database/user-pet.service';

export const PET_CD_PET_PAGE = 21;

interface IPaginatePetCd {
  page: number;
  user: User;
}

export const paginatePetCd = async ({user, page}: IPaginatePetCd) => {
  const pets = await userPetServices.getUserPets({
    page,
    limit: PET_CD_PET_PAGE,
    status: ['adventure', 'back'],
    userId: user.id,
    orderBy: 'petId',
  });
  return generateEmbed({
    pets,
    author: user,
  });
};

interface IGeneratePetCdEmbed {
  author: User;
  pets: IUserPet[];
}

const generateEmbed = ({author, pets}: IGeneratePetCdEmbed) => {
  const fields = generateEmbedFields(pets);
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${author.username}'s pets`,
      iconURL: author.avatarURL() ?? undefined,
    })
    .setColor(BOT_COLOR.embed);
  if (fields.length > 0) {
    embed.setFields(fields);
  } else {
    embed.setDescription('There are no pets on adventure right now.');
  }
  return embed;
};

const generateEmbedFields = (pets: IUserPet[]) => {
  const fields: EmbedField[] = [];
  for (let pet of pets) {
    const epic = !!pet.skills.epic ? BOT_EMOJI.petSkill.epic : '';
    const timeTraveler = !!pet.skills.timeTraveler ? BOT_EMOJI.petSkill.timeTraveler : '';
    const petId = convertNumToPetId(pet.petId).toUpperCase();
    const petTier = convertNumberToRoman(pet.tier);
    const petNameKey = Object.entries(RPG_PET_TYPE).find(
      ([_, value]) => value === pet.name
    )?.[0] as keyof typeof RPG_PET_TYPE;
    const petEmoji = petNameKey ? BOT_EMOJI.pet[petNameKey] : '';
    const statusText = getStatusText(pet);
    if (isPetInIdleStatus(pet)) continue;
    fields.push({
      name: `${epic} ${timeTraveler} \`ID: ${petId}\`\n${petEmoji} ${pet.name} — TIER ${petTier}`,
      value: statusText,
      inline: true,
    });
  }
  return fields;
};

const getStatusText = (pet: IUserPet) => {
  const readyAt = pet.readyAt ? new Date(pet.readyAt).getTime() : null;
  if (pet.status === RPG_PET_STATUS.back || (readyAt && readyAt < Date.now())) {
    return '`BACK FROM ADVENTURE`';
  } else if (pet.status === RPG_PET_STATUS.adventure && readyAt && readyAt > Date.now()) {
    const readyTime = timestampHelper.relative({
      time: readyAt,
    });
    return `**Claim ${readyTime}**`;
  }
  return '**Idle**';
};

const isPetInIdleStatus = (pet: IUserPet) => pet.status === RPG_PET_STATUS.idle;
