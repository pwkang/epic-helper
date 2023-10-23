import type {RPG_COMMAND_TYPE} from '@epic-helper/constants';
import type {ValuesOf} from '../type';

export interface IEventCdReduction {
  commandType: ValuesOf<typeof RPG_COMMAND_TYPE>;
  percentage: number;
  startDate?: Date;
  endDate?: Date;
}
