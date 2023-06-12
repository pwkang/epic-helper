import {BOT_REMINDER_BASE_COOLDOWN} from '../../../constants/epic_helper/command_base_cd';
import {RPG_DONOR_CD_REDUCTION, RPG_DONOR_TIER} from '../../../constants/epic_rpg/rpg';

interface ICalcDonorPExtraHuntCd {
  baseCd: number;
  donor: ValuesOf<typeof RPG_DONOR_TIER>;
  donorP: ValuesOf<typeof RPG_DONOR_TIER> | null;
}

export const calcDonorPExtraHuntCd = ({donorP, donor}: ICalcDonorPExtraHuntCd) => {
  if (!donorP) return 0;

  const extraDuration =
    BOT_REMINDER_BASE_COOLDOWN.hunt * RPG_DONOR_CD_REDUCTION[donorP] -
    BOT_REMINDER_BASE_COOLDOWN.hunt * RPG_DONOR_CD_REDUCTION[donor];

  return extraDuration < 0 ? 0 : extraDuration;
};
