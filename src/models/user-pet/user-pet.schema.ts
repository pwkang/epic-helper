import {Model, Schema} from 'mongoose';
import {IUserPet} from './user-pet.type';
import {RPG_PET_STATUS, RPG_PET_TYPE} from '../../constants/epic_rpg/pet';
import {deleteUserCooldowns, saveUserPetCooldown} from '../user-reminder/user-reminder.service';

const userPetSchema = new Schema<IUserPet>({
  userId: {
    type: String,
    required: true,
    immutable: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    enum: Object.keys(RPG_PET_TYPE),
  },
  petId: {
    type: Number,
    required: true,
    index: true,
  },
  skills: {
    fast: Number,
    happy: Number,
    clever: Number,
    digger: Number,
    lucky: Number,
    timeTraveler: Number,
    epic: Number,
    ascended: Number,
    fighter: Number,
    perfect: Number,
  },
  tier: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(RPG_PET_STATUS),
  },
  readyAt: Date,
});

userPetSchema.post('findOneAndUpdate', async function () {
  const updatedUserId = this.getQuery().userId;
  await updateNextPetReminderTime(updatedUserId, this.model);
});

userPetSchema.post('updateMany', async function () {
  const updatedUserId = this.getQuery().userId;
  await updateNextPetReminderTime(updatedUserId, this.model);
});

async function updateNextPetReminderTime(userId: string, model: Model<IUserPet>) {
  const nextReminderTime = await model
    .find({
      userId,
      readyAt: {$gt: new Date()},
    })
    .sort({readyAt: 1})
    .limit(1);
  if (!nextReminderTime.length)
    await deleteUserCooldowns({
      userId,
      types: ['pet'],
    });
  else
    await saveUserPetCooldown({
      userId,
      readyAt: nextReminderTime[0].readyAt,
    });
}

export default userPetSchema;
