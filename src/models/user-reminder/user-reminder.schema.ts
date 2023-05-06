import {Schema} from 'mongoose';
import {IUserReminder} from './user-reminder.type';
import {RPG_FARM_SEED, RPG_WORKING_TYPE} from '../../types/rpg';

const userReminderSchema = new Schema<IUserReminder>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  type: {type: String, required: true},
  readyAt: {type: Date, required: true},
  props: {
    together: Boolean,
    hardMode: Boolean,
    ultraining: Boolean,
    epicQuest: Boolean,
    workingType: {
      type: String,
      enum: Object.values(RPG_WORKING_TYPE),
    },
    seedType: {
      type: String,
      enum: Object.values(RPG_FARM_SEED),
    },
    petId: Number,
  },
});

export default userReminderSchema;
