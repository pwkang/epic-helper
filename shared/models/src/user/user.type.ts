import type {
  BOT_TIME_FORMAT,
  BOT_TIMEZONE_LIST,
  RPG_AREA,
  RPG_COMMAND_TYPE,
  RPG_DONOR_TIER,
  RPG_ENCHANT_LEVEL,
  RPG_PET_ADV_STATUS,
  RPG_PET_SKILL_ASCEND,
  RPG_PET_SKILL_SPECIAL,
  RPG_PET_TYPE,
  TSkillTierNumber,
} from '@epic-helper/constants';
import type {ValuesOf} from '@epic-helper/types';

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
  rpgInfo: {
    currentArea: keyof typeof RPG_AREA;
    maxArea: keyof typeof RPG_AREA;
    artifacts: {
      pocketWatch: {
        owned: boolean;
        percent: number;
      }
    };
  };
  items: {
    ruby: number;
  };
  stats: {
    best: {
      lootbox: number;
      hunt: number;
      huntTogether: number;
      adventure: number;
      training: number;
      ultraining: number;
      quest: number;
      epicQuest: number;
      working: number;
      farm: number;
    };
  };
  groupCooldowns: {
    userId: string;
    types: (keyof typeof RPG_COMMAND_TYPE)[];
  }[];
  updatedAt: Date;
}
