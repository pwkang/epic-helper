import {RPG_COMMAND_TYPE} from '../../constants/rpg';
import {TIMEZONE_LIST} from '../../constants/timezone';
import {ENCHANT_LEVEL} from '../../constants/enchant';

type ToggleDmOptions = keyof typeof RPG_COMMAND_TYPE | 'all' | 'pet';
type ToggleReminderOptions = keyof typeof RPG_COMMAND_TYPE | 'all' | 'pet';
type ToggleMentionsOptions =
  | keyof typeof RPG_COMMAND_TYPE
  | 'all'
  | 'pet'
  | 'trainingAnswer'
  | 'petCatch';
type CustomMessageOptions = keyof typeof RPG_COMMAND_TYPE | 'pet';

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
    donor: 1 | 0.9 | 0.8 | 0.65;
    donorP: 1 | 0.9 | 0.8 | 0.65 | null;
    channel: string;
    huntSwitch: boolean;
    onOff: boolean;
    timeFormat: '12h' | '24h';
  };
  items: {
    ruby: number;
  };
}
