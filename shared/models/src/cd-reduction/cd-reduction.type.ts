import {RPG_COMMAND_TYPE} from '@epic-helper/constants';
import {ValuesOf} from '../type';

export interface IEventCdReduction {
  commandType: ValuesOf<typeof RPG_COMMAND_TYPE>;
  percentage: number;
  startDate?: Date;
  endDate?: Date;
}
