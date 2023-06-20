import {Schema} from 'mongoose';
import {IEventCdReduction} from './cd-reduction.type';
import {RPG_COMMAND_TYPE} from '@epic-helper/constants';

export const eventCdReductionSchema = new Schema<IEventCdReduction>({
  commandType: {
    type: String,
    enum: Object.values(RPG_COMMAND_TYPE),
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100,
  },
});
