import type {
  RPG_PET_ADV_STATUS,
  RPG_PET_SKILL_ASCEND,
  RPG_PET_SKILL_SPECIAL,
  RPG_PET_TYPE,
  TSkillTierNumber,
} from '@epic-helper/constants';
import type {ValuesOf} from '../type';

export interface IUserPet {
  userId: string;
  petId: number;
  name: ValuesOf<typeof RPG_PET_TYPE>;
  tier: number;
  readyAt: Date | null;
  status: ValuesOf<typeof RPG_PET_ADV_STATUS>;
  skills: Partial<
    Record<
      keyof typeof RPG_PET_SKILL_ASCEND | keyof typeof RPG_PET_SKILL_SPECIAL,
      TSkillTierNumber
    >
  >;
}
