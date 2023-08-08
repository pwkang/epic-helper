import {Schema} from 'mongoose';
import {IUserDuel, IUserDuelUser} from './user-duel.type';

export const userDuelSchema = new Schema<IUserDuel>({
  duelAt: Date,
  users: [
    new Schema<IUserDuelUser>({
      userId: String,
      guildExp: Number,
      isWinner: Boolean,
    }),
  ],
  source: {
    channelId: String,
    serverId: String,
    messageId: String,
  },
});
