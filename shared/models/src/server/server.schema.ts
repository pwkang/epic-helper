import {Schema} from 'mongoose';
import {IEnchantChannel, IServer, IToken, ITTVerificationRules} from './server.type';

const enchantChannelSchema = new Schema<IEnchantChannel>({
  channelId: {type: String, required: true},
  muteDuration: Number,
});

export const serverSchema = new Schema<IServer>({
  serverId: {type: String, required: true},
  name: {type: String, required: true},
  toggle: {
    enchantMute: {type: Boolean, default: true},
    randomEvent: {type: Boolean, default: true},
    ttVerification: {type: Boolean, default: true},
  },
  settings: {
    admin: {
      usersId: [{type: String}],
      rolesId: [{type: String}],
    },
    randomEvent: {
      log: String,
      fish: String,
      coin: String,
      lootbox: String,
      boss: String,
      arena: String,
      miniboss: String,
    },
    enchant: {
      muteDuration: {type: Number, default: 5000},
      channels: [enchantChannelSchema],
    },
    ttVerification: {
      rules: [
        new Schema<ITTVerificationRules>({
          roleId: {type: String, required: true},
          minTT: {type: Number, required: true},
          maxTT: Number,
          message: String,
        }),
      ],
      channelId: String,
    },
  },
  tokens: [
    new Schema<IToken>({
      amount: {type: Number, required: true},
      userId: {type: String, required: true},
    }),
  ],
});
