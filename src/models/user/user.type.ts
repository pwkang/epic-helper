import {RPG_COMMAND_TYPE} from '../../constants/rpg';
import {TIMEZONE_LIST} from '../../constants/timezone';
import {ENCHANT_LEVEL} from '../../constants/enchant';

type ToggleDmOptions = keyof typeof RPG_COMMAND_TYPE | 'all';
type ToggleReminderOptions = keyof typeof RPG_COMMAND_TYPE | 'all';
type ToggleMentionsOptions = keyof typeof RPG_COMMAND_TYPE | 'all' | 'trainingAnswer' | 'petCatch';
type CustomMessageOptions = keyof typeof RPG_COMMAND_TYPE;
export const RPG_DONOR_TIER = {
  nonDonor: 1,
  donor10: 0.9,
  donor20: 0.8,
  donor35: 0.65,
} as const;
export type RpgDonorTier = ValuesOf<typeof RPG_DONOR_TIER>;

export interface IUser {
  userId: string;
  username: string;
  toggle: {
    dm: {
      [key in ToggleDmOptions]: boolean;
    };
    reminder: {
      [key in ToggleReminderOptions]: boolean;
    };
    mentions: {
      [key in ToggleMentionsOptions]: boolean;
    };
    training: {
      all: boolean;
      ruby: boolean;
      basic: boolean;
    };
    petCatch: boolean;
    emoji: boolean;
    quest: {
      all: boolean;
      arena: boolean;
      miniboss: boolean;
    };
    heal: boolean;
    slash: boolean;
    countdown: {
      all: boolean;
      reminder: boolean;
      pet: boolean;
    };
  };
  customMessage: {
    [key in CustomMessageOptions]: string;
  };
  config: {
    timezone: keyof typeof TIMEZONE_LIST;
    heal: number;
    enchant: keyof typeof ENCHANT_LEVEL;
    donor: RpgDonorTier;
    donorP: RpgDonorTier | null;
    channel: string;
    huntSwitch: boolean;
    onOff: boolean;
    timeFormat: '12h' | '24h';
  };
  items: {
    ruby: number;
  };
}
