import {RPG_PET_SKILL, RPG_PET_STATUS, RPG_PET_TYPE} from '../../constants/pet';

export interface IUserPet {
  userId: string;
  petId: number;
  name: ValuesOf<typeof RPG_PET_TYPE>;
  tier: number;
  readyAt: Date | null;
  status: ValuesOf<typeof RPG_PET_STATUS>;
  skills: {
    [key in keyof typeof RPG_PET_SKILL]?: number;
  };
}
