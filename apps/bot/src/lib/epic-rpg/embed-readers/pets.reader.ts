import {Embed, User} from 'discord.js';
import {convertRomanToNumber} from '../../../utils/roman-conversion';
import ms from 'ms';
import {convertPetIdToNum, typedObjectEntries} from '@epic-helper/utils';
import {
  RPG_PET_ADV_STATUS,
  RPG_PET_LABEL,
  RPG_PET_SKILL,
  RPG_PET_SKILL_ASCEND,
  RPG_PET_SKILL_EVENT,
  RPG_PET_SKILL_LABEL,
  RPG_PET_SKILL_SPECIAL,
  RPG_PET_SKILL_TIER,
  TSkillTierStr,
} from '@epic-helper/constants';
import {IUserPet} from '@epic-helper/models';

export interface IReadPets {
  embed: Embed;
  author: User;
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
      status: petStatus ?? RPG_PET_ADV_STATUS.idle,
    });
  }
  return pets;
};

const getPetStatus = (fieldValue: string) => {
  if (fieldValue.includes('idle')) {
    return RPG_PET_ADV_STATUS.idle;
  } else if (fieldValue.includes('back from adventure')) {
    return RPG_PET_ADV_STATUS.back;
  } else if (['learning', 'drilling', 'finding'].some((type) => fieldValue.includes(type))) {
    return RPG_PET_ADV_STATUS.adventure;
  }
  return RPG_PET_ADV_STATUS.idle;
};

const getPetId = (fieldName: string) => {
  return convertPetIdToNum(fieldName.split('\n')[0].split(' ')[1].replaceAll('`', ''));
};
const getPetName = (fieldName: string) => {
  return typedObjectEntries(RPG_PET_LABEL).find(([, name]) => fieldName.includes(name))?.[0];
};

const getPetSkills = (fieldValue: string) => {
  const skill: IUserPet['skills'] = {};
  for (const line of fieldValue.split('\n')) {
    const skillName = typedObjectEntries(RPG_PET_SKILL_LABEL).find(([, skill]) =>
      line.includes(`${skill}**`)
    )?.[0];
    const skillTier = line.match(/\[(SS\+|SS|S|A|B|C|D|E|F)]/)?.[1];
    if (!skillName) continue;
    if (!skillTier) continue;

    if (skillName in RPG_PET_SKILL_ASCEND || skillName in RPG_PET_SKILL_SPECIAL) {
      const filteredSkillName = skillName as
        | keyof typeof RPG_PET_SKILL_ASCEND
        | keyof typeof RPG_PET_SKILL_SPECIAL;
      skill[filteredSkillName] = RPG_PET_SKILL_TIER[skillTier.toLowerCase() as TSkillTierStr];
    }
  }
  return skill;
};

const getPetTier = (fieldName: string) => {
  const tier = fieldName.split(' ').pop();
  return tier ? convertRomanToNumber(tier) : 1;
};

const getPetReadyAt = (fieldValue: string) => {
  if (getPetStatus(fieldValue) !== RPG_PET_ADV_STATUS.adventure) return null;
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
