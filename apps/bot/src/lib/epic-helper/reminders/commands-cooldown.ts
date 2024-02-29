import type {User} from 'discord.js';
import type {RPG_DONOR_TIER} from '@epic-helper/constants';
import {BOT_REMINDER_BASE_COOLDOWN, RPG_COMMAND_TYPE, RPG_DONOR_CD_REDUCTION} from '@epic-helper/constants';
import {userService} from '@epic-helper/services';
import type {ValuesOf} from '@epic-helper/types';

interface IGetCdReduction {
  commandType: ValuesOf<Omit<typeof RPG_COMMAND_TYPE, 'pet'>>;
  userId: User['id'];
  cooldown: number;
}

const donorCdReduction = {
  nonDonor: 1,
  donor10: 0.9,
  donor20: 0.8,
  donor35: 0.65,
} as const;

const canReducedByDonor: Record<ValuesOf<typeof RPG_COMMAND_TYPE>, boolean> = {
  daily: false,
  weekly: false,
  lootbox: false,
  cardHand: true,
  vote: false,
  hunt: true,
  adventure: true,
  training: true,
  duel: false,
  quest: true,
  working: true,
  farm: true,
  horse: true,
  arena: true,
  dungeon: true,
  epicItem: false,
  pet: false,
  petSummary: false,
  xmasChimney: false,
};

/*const isReducedInArea0: Record<ValuesOf<typeof RPG_COMMAND_TYPE>, boolean> = {
  daily: false,
  weekly: false,
  lootbox: true,
  vote: false,
  hunt: true,
  adventure: true,
  training: true,
  duel: true,
  quest: true,
  working: true,
  farm: true,
  horse: true,
  arena: true,
  dungeon: true,
  epicItem: false,
  pet: false,
  petSummary: false,
  xmasChimney: true,
};

const AREA_0_CD_REDUCTION = 0.9;*/


const isReducedByPocketWatch: Record<ValuesOf<typeof RPG_COMMAND_TYPE>, boolean> = {
  daily: false,
  weekly: false,
  lootbox: true,
  cardHand: true,
  vote: false,
  hunt: true,
  adventure: true,
  training: true,
  duel: true,
  quest: true,
  working: true,
  farm: true,
  horse: true,
  arena: true,
  dungeon: true,
  epicItem: false,
  pet: false,
  petSummary: false,
  xmasChimney: false,
};

const isReducedBySpecialEvent: Record<ValuesOf<typeof RPG_COMMAND_TYPE>, boolean> = {
  daily: false,
  weekly: false,
  lootbox: true,
  cardHand: true,
  vote: false,
  hunt: true,
  adventure: true,
  training: true,
  duel: true,
  quest: true,
  working: true,
  farm: true,
  horse: true,
  arena: true,
  dungeon: true,
  epicItem: false,
  pet: false,
  petSummary: false,
  xmasChimney: false,
};

const SPECIAL_EVENT_CD_REDUCTION = 0.5;

export const calcCdReduction = async ({
  commandType,
  userId,
  cooldown,
}: IGetCdReduction) => {
  const userAccount = await userService.getUserAccount(userId);
  if (!userAccount) return cooldown;
  const donor = userAccount.config.donor;
  const donorP = userAccount.config.donorP;

  switch (commandType) {
    case RPG_COMMAND_TYPE.hunt:
      cooldown *= donorP ? donorCdReduction[donorP] : donorCdReduction[donor];
      break;
    default:
      cooldown *= canReducedByDonor[commandType] ? donorCdReduction[donor] : 1;
      break;
  }

  // if (userAccount.rpgInfo.currentArea === 'a0' && isReducedInArea0[commandType])
  //   cooldown *= AREA_0_CD_REDUCTION;

  if (userAccount.rpgInfo.artifacts.pocketWatch.owned && isReducedByPocketWatch[commandType])
    cooldown *= (100 - userAccount.rpgInfo.artifacts.pocketWatch.percent) / 100;

  // for clarification: event will end on time, on the 29th at 23:55
  if (new Date() <= new Date('2024-02-29T23:55:00.000Z') && isReducedBySpecialEvent[commandType])
    cooldown *= SPECIAL_EVENT_CD_REDUCTION;

  return cooldown;
};

interface ICalcDonorPExtraHuntCd {
  donor: ValuesOf<typeof RPG_DONOR_TIER>;
  donorP: ValuesOf<typeof RPG_DONOR_TIER> | null;
}

export const calcExtraHuntCdWithPartner = ({
  donorP,
  donor,
}: ICalcDonorPExtraHuntCd) => {
  if (!donorP) return 0;

  const extraDuration =
    BOT_REMINDER_BASE_COOLDOWN.hunt * RPG_DONOR_CD_REDUCTION[donorP] -
    BOT_REMINDER_BASE_COOLDOWN.hunt * RPG_DONOR_CD_REDUCTION[donor];

  return extraDuration < 0 ? 0 : extraDuration;
};
