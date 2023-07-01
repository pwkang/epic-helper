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
  toggle: {
    active: {type: Boolean, default: true},
    upgraid: {
      reminder: {type: Boolean, default: true},
      sendUpgraidList: {type: Boolean, default: true},
      allowReserved: {type: Boolean, default: true},
    },
    duel: {
      log: {
        active: {type: Boolean, default: true},
        duelAdd: {type: Boolean, default: true},
        duelUndo: {type: Boolean, default: true},
        duelReset: {type: Boolean, default: true},
        duelModify: {type: Boolean, default: true},
      },
      linkRequired: {type: Boolean, default: false},
      autoReset: {type: Boolean, default: true},
    },
  },
});
