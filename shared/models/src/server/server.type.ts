import {RPG_RANDOM_EVENTS} from '@epic-helper/constants';

export interface IEnchantChannel {
  channelId: string;
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
