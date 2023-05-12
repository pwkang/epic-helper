import {Model, Schema} from 'mongoose';
import {IUserReminder} from './user-reminder.type';
import {RPG_FARM_SEED, RPG_WORKING_TYPE} from '../../constants/rpg';
import {
  redisDeleteUserNextReminderTime,
  redisUpdateUserNextReminderTime,
} from '../../services/redis/user-reminder.redis';

const userReminderSchema = new Schema<IUserReminder>(
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
      petId: Number,
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

userReminderSchema.post('findOneAndUpdate', async function (doc) {
  const updatedUserId = this.getQuery().userId;
  await updateNextReminderTime(updatedUserId, this.model);
});

userReminderSchema.post('deleteMany', async function (doc) {
  const deletedUserId = this.getQuery().userId;
  await updateNextReminderTime(deletedUserId, this.model);
});

async function updateNextReminderTime(userId: string, model: Model<IUserReminder>) {
  const nextReminderTime = await model
    .find({
      userId,
    })
    .sort({readyAt: 1})
    .limit(1);
  if (nextReminderTime.length)
    await redisUpdateUserNextReminderTime(userId, nextReminderTime[0].readyAt);
  else await redisDeleteUserNextReminderTime(userId);
}

export default userReminderSchema;
