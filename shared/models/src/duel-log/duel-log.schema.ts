import {Schema} from 'mongoose';
import {IDuelLog} from './duel-log.type';

export const duelLogSchema = new Schema<IDuelLog>({
  duelAt: Date,
  expGained: Number,
  channelId: String,
  messageId: String,
  usersId: [String],
  serverId: String,
  winnerId: String,
});
