import {IGuild} from './guild.type';
import {Schema} from 'mongoose';

export const guildSchema = new Schema<IGuild>({
  serverId: {
    type: String,
    required: true,
  },
  info: {
    name: String,
    stealth: {
      type: Number,
      min: 0,
    },
    level: {
      type: Number,
      min: 0,
    },
    energy: {
      type: Number,
      min: 0,
    },
  },
  roleId: String,
  leaderId: String,
  upgraid: {
    targetStealth: {
      type: Number,
      min: 0,
    },
    channelId: String,
    message: {
      upgrade: String,
      raid: String,
    },
    readyAt: Date,
  },
});
