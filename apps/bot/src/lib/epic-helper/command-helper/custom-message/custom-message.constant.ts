import type {RPG_COMMAND_TYPE} from '@epic-helper/constants';
import {
  BOT_CUSTOM_MESSAGE_TYPES,
  BOT_CUSTOM_MESSAGE_VARIABLES,
} from '@epic-helper/constants';

export const CUSTOM_MESSAGE_PAGE_TYPE = {
  general: 'general',
  other: 'other',
  event: 'event',
  guide: 'guide',
} as const;

interface IPage {
  id: ValuesOf<typeof CUSTOM_MESSAGE_PAGE_TYPE>;
  label: string;
  rows: {
    label: string;
    type: ValuesOf<typeof RPG_COMMAND_TYPE>;
  }[];
}

export const CUSTOM_MESSAGE_PAGES: IPage[] = [
  {
    id: CUSTOM_MESSAGE_PAGE_TYPE.general,
    label: 'General',
    rows: [
      {label: 'Daily', type: 'daily'},
      {label: 'Weekly', type: 'weekly'},
      {label: 'Lootbox', type: 'lootbox'},
      {label: 'Vote', type: 'vote'},
      {label: 'Hunt', type: 'hunt'},
      {label: 'Adventure', type: 'adventure'},
      {label: 'Training', type: 'training'},
      {label: 'Duel', type: 'duel'},
      {label: 'Quest', type: 'quest'},
      {label: 'Working', type: 'working'},
      {label: 'Farm', type: 'farm'},
      {label: 'Horse', type: 'horse'},
      {label: 'Arena', type: 'arena'},
      {label: 'Dungeon', type: 'dungeon'},
    ],
  },
  {
    id: CUSTOM_MESSAGE_PAGE_TYPE.other,
    label: 'Other',
    rows: [
      {label: 'Pet', type: 'pet'},
      {label: 'Epic Items', type: 'epicItem'},
    ],
  },
  {
    id: CUSTOM_MESSAGE_PAGE_TYPE.event,
    label: 'Event',
    rows: [
      {label: 'Xmas Chimney', type: 'xmasChimney'},
    ],
  },
];

export const CUSTOM_MESSAGE_VARIABLES_DESCRIPTION = {
  [BOT_CUSTOM_MESSAGE_VARIABLES.user]: 'Mentions / Username',
  [BOT_CUSTOM_MESSAGE_VARIABLES.cmdLower]: 'Command name (lower case)',
  [BOT_CUSTOM_MESSAGE_VARIABLES.cmdUpper]: 'Command name (upper case)',
  [BOT_CUSTOM_MESSAGE_VARIABLES.emoji]: 'Default animated emoji',
  [BOT_CUSTOM_MESSAGE_VARIABLES.slash]: 'Clickable slash command',
  [BOT_CUSTOM_MESSAGE_VARIABLES.petId]: 'Ready pets ID',
  [BOT_CUSTOM_MESSAGE_VARIABLES.nextReminder]: 'Next reminder countdown',
} as const;

export const CUSTOM_MESSAGE_TYPES_DISPLAY_NAME: Record<
  keyof typeof BOT_CUSTOM_MESSAGE_TYPES,
  string
> = {
  ...BOT_CUSTOM_MESSAGE_TYPES,
  [BOT_CUSTOM_MESSAGE_TYPES.all]: 'default',
} as const;
