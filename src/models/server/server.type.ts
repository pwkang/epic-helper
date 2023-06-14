import {ObjectId} from 'mongoose';
import {RPG_RANDOM_EVENTS} from '../../constants/epic-rpg/random-events';

export interface IEnchantChannel {
  channelId: string;
  isDefault: boolean;
  muteDuration?: number;
}

export interface IServer {
  serverId: string;
  name: string;
  settings: {
    admin: {
      rolesId: string[];
      usersId: string[];
    };
    randomEvent: Record<keyof typeof RPG_RANDOM_EVENTS, string>;
    enchant: {
      muteDuration: number;
      channels: IEnchantChannel[];
    };
  };
}
