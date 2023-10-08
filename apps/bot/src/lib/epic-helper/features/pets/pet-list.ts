import type {EmbedField, User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {convertNumToPetId, typedObjectEntries} from '@epic-helper/utils';
import type {IUserPet} from '@epic-helper/models';
import type {
  RPG_PET_SKILL_ASCEND,
  RPG_PET_SKILL_SPECIAL,
  TSkillTierNumber,
} from '@epic-helper/constants';
import {
  BOT_COLOR,
  BOT_EMOJI,
  RPG_PET_LABEL,
  RPG_PET_SKILL_EVENT,
  RPG_PET_SKILL_LABEL,
  RPG_PET_SKILL_TIER_REVERSE,
  RPG_PET_TYPE_EVENT,
} from '@epic-helper/constants';
import {convertNumberToRoman} from '../../../../utils/roman-conversion';
import {userPetServices} from '../../../../services/database/user-pet.service';

export const PET_LIST_PET_PET_PAGE = 21;

interface IPaginatePetList {
  page: number;
  author: User;
}

export const paginatePetList = async ({author, page}: IPaginatePetList) => {
  const pets = await userPetServices.getUserPets({
    page,
    limit: PET_LIST_PET_PET_PAGE,
    userId: author.id,
  });

  return generateEmbed({
    pets,
    author,
  });
};

interface IGeneratePetListEmbed {
  pets: IUserPet[];
  author: User;
}

const generateEmbed = async ({pets, author}: IGeneratePetListEmbed) => {
  const fields = generateEmbedPetFields(pets);
  return new EmbedBuilder()
    .setAuthor({
      name: `${author.username}'s pets`,
      iconURL: author.avatarURL() ?? undefined,
    })
    .setColor(BOT_COLOR.embed)
    .setFields(fields);
};

export const generateEmbedPetFields = (pets: IUserPet[]) => {
  const fields: EmbedField[] = [];
  for (const pet of pets) {
    const petName = RPG_PET_LABEL[pet.name];
    const petEmoji = pet.name ? BOT_EMOJI.pet[pet.name] : '';
    fields.push({
      name:
        `\`ID: ${convertNumToPetId(pet.petId)}\`\n` +
        `${petEmoji} ${petName} — ${convertNumberToRoman(pet.tier)}`,
      value: generatePetSkillsRows(pet),
      inline: true,
    });
  }
  return fields;
};

const PET_SKILLS_ORDER: Array<
  keyof typeof RPG_PET_SKILL_ASCEND | keyof typeof RPG_PET_SKILL_SPECIAL
> = [
  'fast',
  'happy',
  'clever',
  'digger',
  'lucky',
  'timeTraveler',
  'epic',
  'ascended',
  'perfect',
  'fighter',
  'master',
];

const generatePetSkillsRows = (pet: IUserPet) => {
  const str = [];
  for (const skill of PET_SKILLS_ORDER) {
    if (!pet.skills[skill]) continue;
    const skillEmoji = BOT_EMOJI.petSkill[skill];
    const skillName = RPG_PET_SKILL_LABEL[skill];
    const skillTier = pet.skills[skill] as TSkillTierNumber;
    const skillTierName = RPG_PET_SKILL_TIER_REVERSE[skillTier].toUpperCase();
    str.push(`${skillEmoji} **${skillName}** [${skillTierName}]`);
  }

  const eventPet = typedObjectEntries(RPG_PET_TYPE_EVENT).find(
    ([, value]) => value === pet.name
  )?.[0];
  if (eventPet) {
    const skillType = RPG_PET_SKILL_EVENT[eventPet];
    const skillName = RPG_PET_SKILL_LABEL[skillType];
    const skillEmoji = BOT_EMOJI.petSkill[skillType];

    str.push(`${skillEmoji} **${skillName}**`);
  }
  if (!str.length)
    str.push(`${BOT_EMOJI.petSkill.normie} ${RPG_PET_SKILL_LABEL.normie}`);
  return str.join('\n');
};
