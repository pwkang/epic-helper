import {Schema} from 'mongoose';
import {IEnchantChannel, IServer} from './server.type';

const enchantChannelSchema = new Schema<IEnchantChannel>({
  channelId: {type: String, required: true},
  muteDuration: Number,
  isDefault: {type: Boolean, default: false},
});

export const serverSchema = new Schema<IServer>({
  name: {type: String, required: true},
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
  },
});
