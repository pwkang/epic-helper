import {Embed, User} from 'discord.js';
import {
  RPG_PET_SKILL,
  RPG_PET_SKILL_TIER,
  RPG_PET_STATUS,
  RPG_PET_TYPE,
} from '../../../constants/pet';
import {convertRomanToNumber} from '../../romanConversion';
import ms from 'ms';
import {convertPetIdToNum} from './petIdConversion';
import {IUserPet} from '../../../models/user-pet/user-pet.type';

interface IReadPets {
  embed: Embed;
  author: User;
}

type TPetStatus = ValuesOf<typeof RPG_PET_STATUS>;

interface IPetInfo {
  name: ValuesOf<typeof RPG_PET_TYPE> | 'unknown';
  tier: number;
  id: number;
  status: TPetStatus;
  readyAt?: Date;
  skill: {
    [key in keyof typeof RPG_PET_SKILL]?: number;
  };
}

export const readPets = ({embed, author}: IReadPets) => {
  const pets: IUserPet[] = [];

  for (let field of embed.fields) {
    const petName = getPetName(field.name);
    if (!petName) continue;
    const petId = getPetId(field.name);
    const petStatus = getPetStatus(field.value);
    const petSkills = getPetSkills(field.value);
    const petTier = getPetTier(field.name);
    const petReadyAt = getPetReadyAt(field.value);
    pets.push({
      name: petName,
      userId: author.id,
      petId,
      tier: petTier,
      skills: petSkills,
      readyAt: petReadyAt,
      status: petStatus ?? RPG_PET_STATUS.idle,
    });
  }
  return pets;
};

const getPetStatus = (fieldValue: string) => {
  if (fieldValue.includes('idle')) {
    return RPG_PET_STATUS.idle;
  } else if (fieldValue.includes('back from adventure')) {
    return RPG_PET_STATUS.back;
  } else if (['learning', 'drilling', 'finding'].some((type) => fieldValue.includes(type))) {
    return RPG_PET_STATUS.adventure;
  }
  return RPG_PET_STATUS.idle;
};

const getPetId = (fieldName: string) => {
  return convertPetIdToNum(fieldName.split('\n')[0].split(' ')[1].replaceAll('`', ''));
};
const getPetName = (fieldName: string) => {
  return Object.values(RPG_PET_TYPE).find((pet) => fieldName.includes(pet));
};

const getPetSkills = (fieldValue: string) => {
  const skill: IPetInfo['skill'] = {};
  for (let line of fieldValue.split('\n')) {
    const skillName = Object.entries(RPG_PET_SKILL).find(([_, skill]) =>
      line.includes(`${skill}**`)
    )?.[0];
    const skillTier = line.match(/\[(SS\+|SS|S|A|B|C|D|E|F)]/)?.[1];
    if (!skillName) continue;
    if (!skillTier) continue;

    skill[skillName as keyof typeof RPG_PET_SKILL] =
      RPG_PET_SKILL_TIER[skillTier.toLowerCase() as keyof typeof RPG_PET_SKILL_TIER];
  }
  return skill;
};

const getPetTier = (fieldName: string) => {
  const tier = fieldName.split(' ').pop();
  return tier ? convertRomanToNumber(tier) : 1;
};

const getPetReadyAt = (fieldValue: string) => {
  if (getPetStatus(fieldValue) !== RPG_PET_STATUS.adventure) return null;
  const timeArr = fieldValue
    .split('\n')
    ?.find((row) => row.includes('Status'))
    ?.split('|')
    .pop()
    ?.split(' ')
    .map((time) => time.replace('**', ''))
    .filter((time) => time !== '');
  if (!timeArr) return null;
  let duration = timeArr.reduce((acc, time) => {
    return acc + ms(time);
  }, 0);
  return new Date(Date.now() + duration);
};
