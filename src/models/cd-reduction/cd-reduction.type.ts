import {RPG_COMMAND_TYPE} from '../../constants/epic-rpg/rpg';

export interface IEventCdReduction {
  commandType: ValuesOf<typeof RPG_COMMAND_TYPE>;
  percentage: Number;
  startDate?: Date;
  endDate?: Date;
}
