import {ValuesOf} from '@epic-helper/ts-utils';
import {RPG_PET_SKILL, RPG_PET_STATUS, RPG_PET_TYPE} from '@epic-helper/constants';

export interface IUserPet {
  userId: string;
  petId: number;
  name: ValuesOf<typeof RPG_PET_TYPE>;
  tier: number;
  readyAt: Date | null;
  status: ValuesOf<typeof RPG_PET_STATUS>;
  skills: Partial<Record<keyof typeof RPG_PET_SKILL, number>>;
}
