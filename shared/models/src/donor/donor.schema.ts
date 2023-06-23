import {IBoostedGuild, IDonor} from './donor.type';
import {Schema} from 'mongoose';
import {DONOR_TIER} from '@epic-helper/constants';

const boostedGuildSchema = new Schema<IBoostedGuild>({
  guildId: {type: String, required: true},
  token: {type: Number, required: true},
});

export const donorSchema = new Schema<IDonor>({
  boostedGuilds: [boostedGuildSchema],
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
});
