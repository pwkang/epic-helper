import type {RPG_RANDOM_EVENTS} from '@epic-helper/constants';

export interface IEnchantChannel {
  channelId: string;
  muteDuration?: number;
}

export interface ITTVerificationRules {
  roleId: string;
  minTT: number;
  maxTT?: number;
  message?: string;
}

export interface IToken {
  userId: string;
  amount: number;
}

export interface IServerToggle {
  enchantMute: boolean;
  randomEvent: boolean;
  ttVerification: boolean;
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
    ttVerification: {
      channelId: string;
      rules: ITTVerificationRules[];
    };
  };
  donor: {
    roles: string[];
  };
  toggle: IServerToggle;
  tokens: IToken[];
}
