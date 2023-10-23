import {Schema} from 'mongoose';
import type {IUserDuel, IUserDuelUser} from './user-duel.type';

export const userDuelSchema = new Schema<IUserDuel>({
  duelAt: Date,
  users: [
    new Schema<IUserDuelUser>({
      userId: {type: String, index: true},
      guildExp: Number,
      isWinner: Boolean,
      reportGuild: {
        type: {
          guildRoleId: String,
          serverId: String,
        },
      },
    }),
  ],
  source: {
    channelId: {type: String, index: true},
    serverId: {type: String, index: true},
    messageId: {type: String, index: true},
  },
});
