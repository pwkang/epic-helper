import {Embed, User} from 'discord.js';
import {convertRomanToNumber} from '../../../utils/roman-conversion';
import ms from 'ms';
import {convertPetIdToNum} from '@epic-helper/utils';
import {
  RPG_PET_SKILL,
  RPG_PET_SKILL_TIER,
  RPG_PET_STATUS,
  RPG_PET_TYPE,
  TSkillTierNumber,
  TSkillTierStr,
} from '@epic-helper/constants';
import {IUserPet} from '@epic-helper/models';

export interface IReadPets {
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
  skill: Record<keyof typeof RPG_PET_SKILL, TSkillTierNumber>;
}

const petsReader = ({embed, author}: IReadPets) => {
  const pets: IUserPet[] = [];

  for (const field of embed.fields) {
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
  const skill: Partial<IPetInfo['skill']> = {};
  for (const line of fieldValue.split('\n')) {
    const skillName = Object.entries(RPG_PET_SKILL).find(([, skill]) =>
      line.includes(`${skill}**`)
    )?.[0] as keyof typeof RPG_PET_SKILL;
    const skillTier = line.match(/\[(SS\+|SS|S|A|B|C|D|E|F)]/)?.[1];
    if (!skillName) continue;
    if (!skillTier) continue;

    skill[skillName] = RPG_PET_SKILL_TIER[skillTier.toLowerCase() as TSkillTierStr];
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
  const duration = timeArr.reduce((acc, time) => {
    return acc + ms(time);
  }, 0);
  return new Date(Date.now() + duration);
};

export default petsReader;
