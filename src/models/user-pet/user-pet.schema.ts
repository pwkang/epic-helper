import {Schema} from 'mongoose';
import {IUserPet} from './user-pet.type';
import {RPG_PET_TYPE} from '../../constants/pet';

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
});

export default userPetSchema;
