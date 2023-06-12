import {EmbedBuilder, EmbedField, User} from 'discord.js';
import {getUserPets} from '../../../../models/user-pet/user-pet.service';
import {convertPetIdToNum} from '../../../../utils/epic_rpg/pet/petIdConversion';
import {IUserPet} from '../../../../models/user-pet/user-pet.type';
import {
  RPG_PET_SKILL,
  RPG_PET_SKILL_TIER,
  RPG_PET_SKILL_TIER_REVERSE,
} from '../../../../constants/epic_rpg/pet';
import {generateEmbedPetFields} from './petListEmbed.lib';
import {BOT_COLOR} from '../../../../constants/bot';
import {BOT_EMOJI} from '../../../../constants/epic_helper/bot_emojis';

interface IGenerateFusionScoreEmbed {
  author: User;
  petIds: string[];
}

export default async function generateFusionScoreEmbed({
  author,
  petIds,
}: IGenerateFusionScoreEmbed) {
  const pets = await getUserPets({
    petsId: petIds.map(convertPetIdToNum),
    userId: author.id,
    orderBy: 'petId',
  });
  const result = calcSelectedPetsFusionScore(pets);
  return generateEmbed({
    pets,
    author,
    result,
  });
}

type TFusionSkills = keyof Pick<
  typeof RPG_PET_SKILL,
  'fast' | 'happy' | 'clever' | 'digger' | 'lucky' | 'timeTraveler' | 'epic'
>;

const skillsToFuse: TFusionSkills[] = [
  'fast',
  'happy',
  'clever',
  'digger',
  'lucky',
  'timeTraveler',
  'epic',
];

interface ICalcSelectedPetsFusionScoreReturn {
  type: TFusionSkills;
  total: number;
  pets: Partial<Record<ValuesOf<typeof RPG_PET_SKILL_TIER>, IUserPet['petId'][]>>;
}

const calcSelectedPetsFusionScore = (pets: IUserPet[]): ICalcSelectedPetsFusionScoreReturn[] => {
  const result: ICalcSelectedPetsFusionScoreReturn[] = [];
  for (let skill of skillsToFuse) {
    const petsWithSkill = pets.filter((pet) => pet.skills[skill]);
    if (!petsWithSkill.length) continue;
    const totalScore = petsWithSkill.reduce((acc, pet) => acc + pet.skills[skill]!, 0);
    const petsBySkillTier = petsWithSkill.reduce((acc, pet) => {
      if (!pet.skills[skill]) return acc;
      const tier = pet.skills[skill] as ValuesOf<typeof RPG_PET_SKILL_TIER>;
      if (!acc[tier]) {
        acc[tier] = [];
      }
      acc[tier]!.push(pet.petId);
      return acc;
    }, {} as ICalcSelectedPetsFusionScoreReturn['pets']);
    result.push({
      type: skill,
      total: totalScore * petsWithSkill.length,
      pets: petsBySkillTier,
    });
  }
  return result;
};

const calcRecommendedFusionScore = (pets: IUserPet[]): ScoreTier => {
  const maxTier = pets.reduce((acc, pet) => Math.max(acc, pet.tier), 0);
  if (maxTier < 8) {
    return recommendedFusionScore[0];
  } else if (maxTier < 15) {
    return recommendedFusionScore[maxTier];
  } else {
    return recommendedFusionScore[15];
  }
};

interface IGenerateEmbed {
  pets: IUserPet[];
  result: ICalcSelectedPetsFusionScoreReturn[];
  author: User;
}

const generateEmbed = ({result, pets, author}: IGenerateEmbed): EmbedBuilder[] => {
  const embeds: EmbedBuilder[] = [];
  for (let i = 0; i < pets.length; i += 21) {
    const _pets = pets.slice(i, i + 21);
    const embed = new EmbedBuilder()
      .addFields(generateEmbedPetFields(_pets))
      .setColor(BOT_COLOR.embed);
    if (i === 0) {
      embed.setAuthor({
        iconURL: author.displayAvatarURL(),
        name: `${author.username}'s pets`,
      });
    }
    embeds.push(embed);
  }
  const resultEmbed = new EmbedBuilder()
    .setTitle('Total & Recommended Score')
    .setColor(BOT_COLOR.embed);
  resultEmbed.setFields(getScoreSummaryFields({result}));
  resultEmbed.setDescription(getScoreSummaryDescription({result, pets}));
  embeds.push(resultEmbed);
  return embeds;
};

interface IGetScoreSummaryDescription {
  result: ICalcSelectedPetsFusionScoreReturn[];
  pets: IUserPet[];
}

const getScoreSummaryDescription = ({result, pets}: IGetScoreSummaryDescription): string => {
  const recommendedFusionScore = calcRecommendedFusionScore(pets);
  let description = '```\n' + '               | Target | Selected | Enough ? \n';
  for (let i = 0; i < result.length; i++) {
    const {total, type} = result[i];
    const skillName = RPG_PET_SKILL[type];
    const recommendedScore = recommendedFusionScore[i + 1];
    const totalScore = total;
    const isEnough = totalScore >= recommendedScore;
    description += `${skillName.padEnd(14, ' ')} | ${String(recommendedScore).padEnd(
      6,
      ' '
    )} | ${totalScore.toString().padEnd(8, ' ')} | ${isEnough ? '✓' : '✗'}\n`;
  }
  description += '```';
  return description;
};

interface IGetScoreSummaryFields {
  result: ICalcSelectedPetsFusionScoreReturn[];
}

const getScoreSummaryFields = ({result}: IGetScoreSummaryFields): EmbedField[] => {
  const fields: EmbedField[] = [];
  for (let i = 0; i < result.length; i++) {
    const {pets, total, type} = result[i];
    const skillName = RPG_PET_SKILL[type];
    const skillEmoji = BOT_EMOJI.petSkill[type];
    const totalScore = total;

    let fieldValue = '';
    for (let i = 9; i > 0; i--) {
      const petIds = pets[i as ValuesOf<typeof RPG_PET_SKILL_TIER>];
      if (!petIds) continue;
      const tierLabel =
        RPG_PET_SKILL_TIER_REVERSE[Number(i) as ValuesOf<typeof RPG_PET_SKILL_TIER>].toUpperCase();
      fieldValue += `**${tierLabel}** x${petIds.length}\n`;
    }
    fields.push({
      name: `${skillEmoji} ${skillName} - ${totalScore}`,
      value: fieldValue,
      inline: true,
    });
  }
  return fields;
};

type ScoreTier = Record<number, number>;

type RecommendedFusionScore = Record<number, ScoreTier>;

const recommendedFusionScore: RecommendedFusionScore = {
  0: {1: 8, 2: 8, 3: 8, 4: 9, 5: 9, 6: 20, 7: 30},
  8: {1: 4, 2: 6, 3: 8, 4: 9, 5: 9, 6: 18, 7: 28},
  9: {1: 4, 2: 6, 3: 8, 4: 9, 5: 9, 6: 16, 7: 26},
  10: {1: 4, 2: 4, 3: 6, 4: 8, 5: 9, 6: 14, 7: 24},
  11: {1: 4, 2: 4, 3: 6, 4: 8, 5: 9, 6: 12, 7: 24},
  12: {1: 4, 2: 4, 3: 6, 4: 8, 5: 9, 6: 12, 7: 24},
  13: {1: 4, 2: 4, 3: 6, 4: 8, 5: 9, 6: 9, 7: 24},
  14: {1: 4, 2: 4, 3: 4, 4: 6, 5: 8, 6: 9, 7: 22},
  15: {1: 4, 2: 4, 3: 4, 4: 6, 5: 8, 6: 9, 7: 20},
};
