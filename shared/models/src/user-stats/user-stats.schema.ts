import type {Document} from 'mongoose';
import {Schema} from 'mongoose';
import type {IUserStats} from './user-stats.type';
import {ObjectId} from 'mongodb';

export const userStatsSchema = new Schema<IUserStats & Document>({
  _id: ObjectId,
  userId: {type: String, required: true, index: true},
  statsAt: {type: Date, required: true},
  rpg: {
    lootbox: {type: Number, donor: 0},
    hunt: {type: Number, donor: 0},
    huntTogether: {type: Number, donor: 0},
    adventure: {type: Number, donor: 0},
    training: {type: Number, donor: 0},
    ultraining: {type: Number, donor: 0},
    quest: {type: Number, donor: 0},
    epicQuest: {type: Number, donor: 0},
    working: {type: Number, donor: 0},
    farm: {type: Number, donor: 0},
  },
});
