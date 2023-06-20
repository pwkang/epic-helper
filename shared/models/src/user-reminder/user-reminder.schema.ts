import {Schema} from 'mongoose';
import {IUserReminder} from './user-reminder.type';
import {RPG_FARM_SEED, RPG_WORKING_TYPE} from '@epic-helper/constants';

export const userReminderSchema = new Schema<IUserReminder>(
  {
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
      lootboxType: String,
    },
  },
  {
    statics: {
      findNextReadyAt(userId: string) {
        return this.find({userId, readyAt: {$gt: new Date()}})
          .sort({readyAt: 1})
          .limit(1);
      },
    },
  }
);
