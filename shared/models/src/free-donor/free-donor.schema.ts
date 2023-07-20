import {IFreeDonor} from './free-donor.type';
import {Schema} from 'mongoose';

export const freeDonorSchema = new Schema<IFreeDonor>({
  discordId: {type: String, required: true, index: true, unique: true},
  expiresAt: {type: Date},
  token: {type: Number},
});
