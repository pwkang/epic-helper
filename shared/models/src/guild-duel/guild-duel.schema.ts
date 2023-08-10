import {IGuildDuel, IGuildDuelUser} from './guild-duel.type';
import {Schema} from 'mongoose';

export const guildDuelSchema = new Schema<IGuildDuel>({
  guildRoleId: {type: String, required: true},
  serverId: {type: String, required: true},
  weekAt: {type: Date, required: true},
  users: [
    new Schema<IGuildDuelUser>({
      duelCount: {type: Number, default: 0},
      totalExp: {type: Number, default: 0},
      userId: {type: String},
    }),
  ],
});
