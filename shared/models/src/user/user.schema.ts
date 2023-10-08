import {Schema} from 'mongoose';
import {IUser} from './user.type';
import {BOT_TIME_FORMAT, BOT_TIMEZONE_LIST, RPG_DONOR_TIER} from '@epic-helper/constants';

export const userSchema = new Schema<IUser>({
  userId: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
    index: true,
  },
  username: String,
  toggle: {
    dm: {
      all: {type: Boolean, default: false},
      daily: {type: Boolean, default: false},
      weekly: {type: Boolean, default: false},
      lootbox: {type: Boolean, default: false},
      vote: {type: Boolean, default: false},
      hunt: {type: Boolean, default: false},
      adventure: {type: Boolean, default: false},
      training: {type: Boolean, default: false},
      duel: {type: Boolean, default: false},
      quest: {type: Boolean, default: false},
      working: {type: Boolean, default: false},
      farm: {type: Boolean, default: false},
      horse: {type: Boolean, default: false},
      arena: {type: Boolean, default: false},
      dungeon: {type: Boolean, default: false},
      pet: {type: Boolean, default: false},
      epicItem: {type: Boolean, default: false},
    },
    reminder: {
      all: {type: Boolean, default: true},
      daily: {type: Boolean, default: true},
      weekly: {type: Boolean, default: true},
      lootbox: {type: Boolean, default: true},
      vote: {type: Boolean, default: true},
      hunt: {type: Boolean, default: true},
      adventure: {type: Boolean, default: true},
      training: {type: Boolean, default: true},
      duel: {type: Boolean, default: true},
      quest: {type: Boolean, default: true},
      working: {type: Boolean, default: true},
      farm: {type: Boolean, default: true},
      horse: {type: Boolean, default: true},
      arena: {type: Boolean, default: true},
      dungeon: {type: Boolean, default: true},
      pet: {type: Boolean, default: true},
      epicItem: {type: Boolean, default: true},
    },
    mentions: {
      all: {type: Boolean, default: true},
      daily: {type: Boolean, default: true},
      weekly: {type: Boolean, default: true},
      lootbox: {type: Boolean, default: true},
      vote: {type: Boolean, default: true},
      hunt: {type: Boolean, default: true},
      adventure: {type: Boolean, default: true},
      training: {type: Boolean, default: true},
      duel: {type: Boolean, default: true},
      quest: {type: Boolean, default: true},
      working: {type: Boolean, default: true},
      farm: {type: Boolean, default: true},
      horse: {type: Boolean, default: true},
      arena: {type: Boolean, default: true},
      dungeon: {type: Boolean, default: true},
      pet: {type: Boolean, default: true},
      trainingAnswer: {type: Boolean, default: true},
      petCatch: {type: Boolean, default: true},
      epicItem: {type: Boolean, default: true},
    },
    training: {
      all: {type: Boolean, default: true},
      ruby: {type: Boolean, default: true},
      basic: {type: Boolean, default: true},
    },
    huntSwitch: {type: Boolean, default: false},
    petCatch: {type: Boolean, default: true},
    emoji: {type: Boolean, default: true},
    quest: {
      all: {type: Boolean, default: true},
      arena: {type: Boolean, default: true},
      miniboss: {type: Boolean, default: true},
    },
    heal: {type: Boolean, default: true},
    slash: {type: Boolean, default: true},
    countdown: {
      all: {type: Boolean, default: true},
      reminder: {type: Boolean, default: true},
      pet: {type: Boolean, default: true},
    },
  },
  customMessage: {
    daily: String,
    weekly: String,
    lootbox: String,
    vote: String,
    hunt: String,
    adventure: String,
    training: String,
    duel: String,
    quest: String,
    working: String,
    farm: String,
    horse: String,
    arena: String,
    dungeon: String,
    use: String,
    pet: String,
  },
  channel: {
    all: String,
    daily: String,
    weekly: String,
    lootbox: String,
    vote: String,
    hunt: String,
    adventure: String,
    training: String,
    duel: String,
    quest: String,
    working: String,
    farm: String,
    horse: String,
    arena: String,
    dungeon: String,
    use: String,
    pet: String,
  },
  config: {
    timezone: {
      type: String,
      // default: BOT_TIMEZONE_LIST.UTC,
      enum: Object.values(BOT_TIMEZONE_LIST),
    },
    heal: {type: Number, default: 0},
    enchant: {type: String},
    donor: {type: String, default: RPG_DONOR_TIER.nonDonor},
    donorP: {type: String},
    onOff: {type: Boolean, default: true},
    timeFormat: {
      type: String,
      default: BOT_TIME_FORMAT['12h'],
      enum: Object.values(BOT_TIME_FORMAT),
    },
  },
  items: {
    ruby: {type: Number, default: 0},
  },
});
