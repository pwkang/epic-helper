import type {IDonor} from './donor.type';
import {Schema} from 'mongoose';
import {DONOR_TIER} from '@epic-helper/constants';

export const donorSchema = new Schema<IDonor>({
  discord: {
    type: {
      userId: {type: String},
      username: {type: String},
    },
  },
  expiresAt: {type: Date},
  patreon: {
    type: {
      email: {type: String},
      fullName: {type: String},
      memberId: {type: String},
      userId: {type: String},
    },
  },
  tier: {type: String, enum: Object.values(DONOR_TIER)},
  active: {type: Boolean, default: false},
});
