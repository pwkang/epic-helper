import {RPG_COMMAND_TYPE, RPG_DONOR_TIER} from '../../constants/rpg';
import {TIMEZONE_LIST} from '../../constants/timezone';
import {ENCHANT_LEVEL} from '../../constants/enchant';

type ToggleDmOptions = keyof typeof RPG_COMMAND_TYPE | 'all';
type ToggleReminderOptions = keyof typeof RPG_COMMAND_TYPE | 'all';
type ToggleMentionsOptions = keyof typeof RPG_COMMAND_TYPE | 'all' | 'trainingAnswer' | 'petCatch';
type CustomMessageOptions = keyof typeof RPG_COMMAND_TYPE;
type ReminderChannelOptions = keyof typeof RPG_COMMAND_TYPE | 'all';

export interface IUser {
  userId: string;
  username: string;
  toggle: {
    dm: Record<ToggleDmOptions, boolean>;
    reminder: Record<ToggleReminderOptions, boolean>;
    mentions: Record<ToggleMentionsOptions, boolean>;
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
  customMessage: Record<CustomMessageOptions, string>;
  channel: Record<ReminderChannelOptions, string>;
  config: {
    timezone: keyof typeof TIMEZONE_LIST;
    heal: number;
    enchant: keyof typeof ENCHANT_LEVEL;
    donor: ValuesOf<typeof RPG_DONOR_TIER>;
    donorP: ValuesOf<typeof RPG_DONOR_TIER> | null;
    huntSwitch: boolean;
    onOff: boolean;
    timeFormat: '12h' | '24h';
  };
  items: {
    ruby: number;
  };
}
