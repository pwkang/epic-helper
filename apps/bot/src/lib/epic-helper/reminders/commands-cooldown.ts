import type {User} from 'discord.js';
import type {RPG_DONOR_TIER} from '@epic-helper/constants';
import {
  BOT_REMINDER_BASE_COOLDOWN,
  RPG_COMMAND_TYPE,
  RPG_DONOR_CD_REDUCTION
} from '@epic-helper/constants';
import {userService} from '../../../services/database/user.service';

interface IGetCdReduction {
  commandType: ValuesOf<Omit<typeof RPG_COMMAND_TYPE, 'pet'>>;
  userId: User['id'];
  cooldown: number;
}

const donorCdReduction = {
  nonDonor: 1,
  donor10: 0.9,
  donor20: 0.8,
  donor35: 0.65
} as const;

const canReducedByDonor = {
  daily: false,
  weekly: false,
  lootbox: false,
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
  epicItem: false
};

export const calcCdReduction = async ({
  commandType,
  userId,
  cooldown
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

  return cooldown;
};

interface ICalcDonorPExtraHuntCd {
  donor: ValuesOf<typeof RPG_DONOR_TIER>;
  donorP: ValuesOf<typeof RPG_DONOR_TIER> | null;
}

export const calcExtraHuntCdWithPartner = ({
  donorP,
  donor
}: ICalcDonorPExtraHuntCd) => {
  if (!donorP) return 0;

  const extraDuration =
    BOT_REMINDER_BASE_COOLDOWN.hunt * RPG_DONOR_CD_REDUCTION[donorP] -
    BOT_REMINDER_BASE_COOLDOWN.hunt * RPG_DONOR_CD_REDUCTION[donor];

  return extraDuration < 0 ? 0 : extraDuration;
};
