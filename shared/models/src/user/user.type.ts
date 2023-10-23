import type {
  BOT_TIME_FORMAT,
  BOT_TIMEZONE_LIST,
  RPG_COMMAND_TYPE,
  RPG_DONOR_TIER,
  RPG_ENCHANT_LEVEL,
} from '@epic-helper/constants';
import type {ValuesOf} from '../type';

type ToggleDmOptions = keyof typeof RPG_COMMAND_TYPE | 'all';
type ToggleReminderOptions = keyof typeof RPG_COMMAND_TYPE | 'all';
type ToggleMentionsOptions =
  | keyof typeof RPG_COMMAND_TYPE
  | 'all'
  | 'trainingAnswer'
  | 'petCatch';
type CustomMessageOptions = keyof typeof RPG_COMMAND_TYPE | 'all';
type ReminderChannelOptions = keyof typeof RPG_COMMAND_TYPE | 'all';

export interface IUserToggle
  extends Record<string, boolean | Record<string, boolean>> {
  dm: Record<ToggleDmOptions, boolean>;
  reminder: Record<ToggleReminderOptions, boolean>;
  mentions: Record<ToggleMentionsOptions, boolean>;
  training: {
    all: boolean;
    ruby: boolean;
    basic: boolean;
  };
  huntSwitch: boolean;
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
}

export interface IUser {
  userId: string;
  username: string;
  toggle: IUserToggle;
  customMessage: Record<CustomMessageOptions, string>;
  channel: Record<ReminderChannelOptions, string>;
  config: {
    timezone: keyof typeof BOT_TIMEZONE_LIST;
    heal: number;
    enchant: keyof typeof RPG_ENCHANT_LEVEL;
    donor: ValuesOf<typeof RPG_DONOR_TIER>;
    donorP: ValuesOf<typeof RPG_DONOR_TIER> | null;
    onOff: boolean;
    timeFormat: ValuesOf<typeof BOT_TIME_FORMAT>;
  };
  items: {
    ruby: number;
  };
}
