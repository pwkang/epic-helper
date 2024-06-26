import type {IUpgraid} from './upgraid.type';
import {Schema} from 'mongoose';

const recordSchema = new Schema<IUpgraid['users'][0]['records'][0]>({
  channelId: String,
  serverId: String,
  commandType: String,
  messageId: String,
  upgraidAt: Date,
});

const userSchema = new Schema<IUpgraid['users'][0]>({
  uId: String,
  records: {
    type: [recordSchema],
  },
});

export const upgraidSchema = new Schema<IUpgraid>({
  roleId: String,
  serverId: String,
  weekAt: Date,
  users: {
    type: [userSchema],
  },
});
