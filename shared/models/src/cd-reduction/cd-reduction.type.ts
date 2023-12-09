import type {RPG_COMMAND_TYPE} from '@epic-helper/constants';
import type {ValuesOf} from '@epic-helper/types';

export interface IEventCdReduction {
  commandType: ValuesOf<typeof RPG_COMMAND_TYPE>;
  percentage: number;
  startDate?: Date;
  endDate?: Date;
}
