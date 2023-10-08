import type {User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {userPetServices} from '../../../../services/database/user-pet.service';
import type {IUserPet} from '@epic-helper/models';
import type {TSkillTierNumber} from '@epic-helper/constants';
import {
  BOT_COLOR,
  BOT_EMOJI,
  RPG_PET_LABEL,
  RPG_PET_SKILL,
  RPG_PET_SKILL_LABEL,
  RPG_PET_SKILL_TIER_REVERSE,
  RPG_PET_TYPE,
  RPG_PET_TYPE_BASIC,
} from '@epic-helper/constants';
import {convertNumberToRoman} from '../../../../utils/roman-conversion';
import {convertNumToPetId, typedObjectEntries} from '@epic-helper/utils';
import type {ValuesOf} from '@epic-helper/models/dist/type';

interface IPetSummaryHelper {
  author: User;
  type: 'tier' | 'skill';
}

export const _petSummaryHelper = async ({author, type}: IPetSummaryHelper) => {
  const userAccount = await userService.getUserAccount(author.id);
  if (!userAccount) return null;
  const userPets = await userPetServices.getUserPets({
    userId: author.id,
  });

  const renderTier = () => {
    const embed = generateTierEmbed({
      author,
      pets: userPets,
    });
    return {
      embeds: [embed],
    };
  };

  const renderSkill = () => {
    const embed = generateSkillEmbed({
      author,
      pets: userPets,
    });
    return {
      embeds: [embed],
    };
  };

  const renderMap = {
    tier: renderTier,
    skill: renderSkill,
  };

  return {
    render: renderMap[type],
  };
};

const PET_ORDER = {
  [RPG_PET_TYPE.dog]: 1,
  [RPG_PET_TYPE.cat]: 2,
  [RPG_PET_TYPE.dragon]: 3,
  [RPG_PET_TYPE.pumpkinBat]: 4,
  [RPG_PET_TYPE.hamster]: 5,
  [RPG_PET_TYPE.pinkFish]: 6,
  [RPG_PET_TYPE.pony]: 7,
  [RPG_PET_TYPE.goldenBunny]: 8,
  [RPG_PET_TYPE.penguin]: 9,
  [RPG_PET_TYPE.snowman]: 10,
  [RPG_PET_TYPE.epicPanda]: 11,
  [RPG_PET_TYPE.voiDog]: 12,
  [RPG_PET_TYPE.worker]: 13,
  [RPG_PET_TYPE.bunny]: 14,
  [RPG_PET_TYPE.fakeGoldenBunny]: 15,
  [RPG_PET_TYPE.snowball]: 16,
} as const;

const PET_SKILL_ORDER = {
  [RPG_PET_SKILL.fast]: 1,
  [RPG_PET_SKILL.happy]: 2,
  [RPG_PET_SKILL.clever]: 3,
  [RPG_PET_SKILL.digger]: 4,
  [RPG_PET_SKILL.lucky]: 5,
  [RPG_PET_SKILL.timeTraveler]: 6,
  [RPG_PET_SKILL.epic]: 7,
  [RPG_PET_SKILL.ascended]: 8,
  [RPG_PET_SKILL.perfect]: 9,
  [RPG_PET_SKILL.fighter]: 10,
  [RPG_PET_SKILL.master]: 11,
  [RPG_PET_SKILL.normie]: 12,
} as const;

interface IGenerateTierEmbed {
  author: User;
  pets: IUserPet[];
}

const generateTierEmbed = ({author, pets}: IGenerateTierEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: `${author.username}'s pets`,
    iconURL: author.avatarURL() ?? undefined,
  });

  const tierMap = new Map<number, IUserPet[]>();

  for (const pet of pets) {
    const tier = pet.tier;
    if (!tierMap.has(tier)) tierMap.set(tier, []);
    tierMap.get(tier)?.push(pet);
  }
  const tierList = [...tierMap.keys()].sort((a, b) => a - b);

  for (const tier of tierList) {
    const petList = tierMap.get(tier) ?? [];
    const totalPets = petList?.length;
    const petTypeMap = new Map<ValuesOf<typeof RPG_PET_TYPE>, IUserPet[]>();
    for (const pet of petList) {
      const petType = pet.name;
      if (!petTypeMap.has(petType)) petTypeMap.set(petType, []);
      petTypeMap.get(petType)?.push(pet);
    }
    const value = [];
    value.push(`Total: **${totalPets}**`);
    const petsString = [...petTypeMap.entries()]
      .sort((a, b) => PET_ORDER[a[0]] - PET_ORDER[b[0]])
      .reduce((acc, [petType, petList]) => {
        const emoji = BOT_EMOJI.pet[petType];
        const petName = RPG_PET_LABEL[petType];
        const petIds = petList
          .map((pet) => convertNumToPetId(pet.petId))
          .map((id) => `\`${id}\``)
          .join(' | ');
        acc.push(`${emoji}**${petName}**: ${petIds}`);
        return acc;
      }, [] as string[]);

    value.push(...petsString);

    embed.addFields({
      name: 'TIER ' + convertNumberToRoman(tier),
      value: value.join('\n'),
      inline: true,
    });
  }

  return embed;
};

interface IGenerateSkillEmbed {
  author: User;
  pets: IUserPet[];
}

const generateSkillEmbed = ({author, pets}: IGenerateSkillEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: `${author.username}'s pets`,
    iconURL: author.avatarURL() ?? undefined,
  });

  const skillMap = new Map<keyof IUserPet['skills'], IUserPet[]>();

  for (const pet of pets) {
    for (const [skill] of typedObjectEntries(pet.skills)) {
      if (!skillMap.has(skill)) skillMap.set(skill, []);
      skillMap.get(skill)?.push(pet);
    }
    if (Object.keys(pet.skills).length === 0) {
      const skill = RPG_PET_SKILL.normie;
      if (!skillMap.has(skill)) skillMap.set(skill, []);
      skillMap.get(skill)?.push(pet);
    }
  }
  for (const skillType of Object.keys(
    PET_SKILL_ORDER
  ) as (keyof IUserPet['skills'])[]) {
    const emoji = BOT_EMOJI.petSkill[skillType];
    const skillName = RPG_PET_SKILL_LABEL[skillType];
    const petList = skillMap.get(skillType) ?? [];
    const tierMap = new Map<TSkillTierNumber | 0, IUserPet[]>();
    if (skillType === RPG_PET_SKILL.normie) {
      for (const pet of petList) {
        if (Object.keys(pet.skills).length) continue;
        const tier = 0;
        if (!tierMap.has(tier)) tierMap.set(tier, []);
        tierMap.get(tier)?.push(pet);
      }
    } else {
      for (const pet of petList) {
        const tier = pet.skills[skillType];
        if (!tier) continue;
        if (!tierMap.has(tier)) tierMap.set(tier, []);
        tierMap.get(tier)?.push(pet);
      }
    }
    const value = [...tierMap.entries()]
      .sort((a, b) => b[0] - a[0])
      .reduce((acc, [tier, petList]) => {
        const petIds = petList
          .sort((a, b) => a.petId - b.petId)
          .map((pet) => ({
            isSpecial: Object.values(RPG_PET_TYPE_BASIC).every(
              (type) => type !== pet.name
            ),
            petId: pet.petId,
          }))
          .map(
            (pet) =>
              `${convertNumToPetId(pet.petId)}${pet.isSpecial ? '*' : ''}`
          )
          .map((id) => `\`${id}\``)
          .join(' | ');
        const isNormie = !tier;
        let tierName = isNormie
          ? ''
          : RPG_PET_SKILL_TIER_REVERSE[tier].toUpperCase();
        if (!isNormie) tierName = `**${tierName}**:`;

        acc.push(`${tierName} ${petIds}`);
        return acc;
      }, [] as string[]);

    if (!value.length) value.push('None');

    embed.addFields({
      name: `${emoji} **${skillName}**`,
      value: value.join('\n'),
      inline: true,
    });
  }
  embed.setFooter({
    text: '* Special pet',
  });

  return embed;
};
