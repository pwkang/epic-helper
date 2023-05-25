import {EmbedBuilder, EmbedField, User} from 'discord.js';
import {BOT_COLOR} from '../../../../constants/bot';
import {IUserPet} from '../../../../models/user-pet/user-pet.type';
import {RPG_PET_SKILL, RPG_PET_SKILL_TIER_REVERSE, RPG_PET_TYPE} from '../../../../constants/pet';
import {BOT_EMOJI} from '../../../../constants/bot_emojis';
import {convertNumToPetId} from '../../../../utils/epic_rpg/pet/petIdConversion';
import {numberToRoman} from '../../../../romanConversion';

interface IGeneratePetListEmbed {
  pets: IUserPet[];
  author: User;
}

export const generatePetListEmbed = async ({pets, author}: IGeneratePetListEmbed) => {
  const fields = generateEmbedFields(pets);
  return new EmbedBuilder()
    .setAuthor({
      name: `${author.username}'s pets`,
      iconURL: author.avatarURL() ?? undefined,
    })
    .setColor(BOT_COLOR.embed)
    .setFields(fields);
};

const generateEmbedFields = (pets: IUserPet[]) => {
  const fields: EmbedField[] = [];
  for (let pet of pets) {
    const petNameKey = Object.entries(RPG_PET_TYPE).find(
      ([key, value]) => value === pet.name
    )?.[0] as keyof typeof RPG_PET_TYPE;
    const petEmoji = petNameKey ? BOT_EMOJI.pet[petNameKey] : '';
    fields.push({
      name:
        `\`ID: ${convertNumToPetId(pet.petId).toUpperCase()}\`\n` +
        `${petEmoji} ${pet.name} — ${numberToRoman(pet.tier)}`,
      value: generatePetSkillsRows(pet),
      inline: true,
    });
  }
  return fields;
};

const PET_SKILLS_ORDER: Array<keyof typeof RPG_PET_SKILL> = [
  'fast',
  'happy',
  'clever',
  'digger',
  'lucky',
  'timeTraveler',
  'epic',
  'ascended',
  'perfect',
];

const generatePetSkillsRows = (pet: IUserPet) => {
  const str = [];
  for (let skill of PET_SKILLS_ORDER) {
    if (pet.skills[skill]) {
      // @ts-ignore
      const skillEmoji = BOT_EMOJI.petSkill[skill];
      // @ts-ignore
      const skillName = RPG_PET_SKILL[skill];
      const skillTier = pet.skills[skill] ?? 1;
      // @ts-ignore
      const skillTierName = RPG_PET_SKILL_TIER_REVERSE[skillTier].toUpperCase();
      str.push(`${skillEmoji} **${skillName}** [${skillTierName}]`);
    }
  }

  if (pet.tier >= 10) {
    const skillTier = pet.tier - 9;
    // @ts-ignore
    const skillTierName = RPG_PET_SKILL_TIER_REVERSE[skillTier].toUpperCase();
    str.push(`${BOT_EMOJI.petSkill.fighter} **${RPG_PET_SKILL.fighter}** [${skillTierName}]`);
  }

  if (pet.tier >= 15) {
    const skillTier = pet.tier - 14;
    // @ts-ignore
    const skillTierName = RPG_PET_SKILL_TIER_REVERSE[skillTier].toUpperCase();
    str.push(`${BOT_EMOJI.petSkill.master} **${RPG_PET_SKILL.master}** [${skillTierName}]`);
  }
  if (!str.length) str.push(`${BOT_EMOJI.petSkill.normie} ${RPG_PET_SKILL.normie}`);
  return str.join('\n');
};
