import {IUserPet} from '../../../../models/user-pet/user-pet.type';
import {EmbedBuilder, EmbedField, User} from 'discord.js';
import {BOT_COLOR} from '../../../../constants/bot';
import {convertNumToPetId} from '../../../../utils/epic_rpg/pet/petIdConversion';
import {BOT_EMOJI} from '../../../../constants/bot_emojis';
import {numberToRoman} from '../../../../romanConversion';
import {RPG_PET_STATUS, RPG_PET_TYPE} from '../../../../constants/pet';
import dynamicTimeStamp from '../../../../utils/discord/dynamicTimestamp';

export const PET_CD_PET_PAGE = 21;

interface IGeneratePetCdEmbed {
  author: User;
  pets: IUserPet[];
}

export const generatePetCdEmbed = ({author, pets}: IGeneratePetCdEmbed) => {
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
    const petTier = numberToRoman(pet.tier);
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
  if (!readyAt) {
    return '**Idle**';
  } else if (pet.status === RPG_PET_STATUS.back || readyAt < Date.now()) {
    return '`BACK FROM ADVENTURE`';
  } else if (pet.status === RPG_PET_STATUS.adventure && readyAt > Date.now()) {
    return `**Claim ${dynamicTimeStamp({
      time: readyAt,
    })}**`;
  }
  return '**Idle**';
};

const isPetInIdleStatus = (pet: IUserPet) => pet.status === RPG_PET_STATUS.idle || !pet.readyAt;
