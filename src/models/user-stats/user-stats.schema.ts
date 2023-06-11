import {Schema} from 'mongoose';
import {IUserStats} from './user-stats.types';

const userStatsSchema = new Schema<IUserStats>({
  userId: {type: String, required: true, index: true},
  statsAt: {type: Date, required: true},
  rpg: {
    lootbox: {type: Number, default: 0},
    hunt: {type: Number, default: 0},
    huntTogether: {type: Number, default: 0},
    adventure: {type: Number, default: 0},
    training: {type: Number, default: 0},
    ultraining: {type: Number, default: 0},
    quest: {type: Number, default: 0},
    epicQuest: {type: Number, default: 0},
    working: {type: Number, default: 0},
    farm: {type: Number, default: 0},
  },
});

export default userStatsSchema;
