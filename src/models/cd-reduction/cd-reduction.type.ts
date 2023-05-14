import {RPG_COMMAND_TYPE} from '../../constants/rpg';

export interface IEventCdReduction {
  commandType: ValuesOf<typeof RPG_COMMAND_TYPE>;
  percentage: Number;
  startDate?: Date;
  endDate?: Date;
}
