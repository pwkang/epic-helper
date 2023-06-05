import {COMMAND_BASE_COOLDOWN} from '../../../constants/command_base_cd';
import {DONOR_CD_REDUCTION, RPG_DONOR_TIER} from '../../../constants/rpg';

interface ICalcDonorPExtraHuntCd {
  baseCd: number;
  donor: ValuesOf<typeof RPG_DONOR_TIER>;
  donorP: ValuesOf<typeof RPG_DONOR_TIER> | null;
}

export const calcDonorPExtraHuntCd = ({donorP, donor}: ICalcDonorPExtraHuntCd) => {
  if (!donorP) return 0;

  const extraDuration =
    COMMAND_BASE_COOLDOWN.hunt * DONOR_CD_REDUCTION[donorP] -
    COMMAND_BASE_COOLDOWN.hunt * DONOR_CD_REDUCTION[donor];

  return extraDuration < 0 ? 0 : extraDuration;
};
