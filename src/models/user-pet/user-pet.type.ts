import {RPG_PET_SKILL, RPG_PET_TYPE} from '../../types/rpg';
import {type} from 'os';

export interface IUserPet {
  userId: string;
  petId: number;
  name: ValuesOf<typeof RPG_PET_TYPE>;
  tier: number;
  skills: {
    [key in keyof typeof RPG_PET_SKILL]?: number;
  };
}
