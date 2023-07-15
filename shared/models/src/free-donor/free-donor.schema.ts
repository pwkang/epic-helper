import {IFreeDonor} from './free-donor.type';
import {Schema} from 'mongoose';
import {IBoostedGuild} from '../donor/donor.type';

const boostedGuildSchema = new Schema<IBoostedGuild>({
  guildId: {type: String, required: true},
  token: {type: Number, required: true},
});

export const freeDonorSchema = new Schema<IFreeDonor>({
  boostedGuilds: [boostedGuildSchema],
  discordId: {type: String, required: true, index: true, unique: true},
  expiresAt: {type: Date},
  token: {type: Number},
});
