import {BOT_EMOJI, BOT_REMINDER_DEFAULT_MESSAGES, RPG_COMMAND_TYPE} from '@epic-helper/constants';

export const CUSTOM_MESSAGE_PAGE_TYPE = {
  general: 'general',
  other: 'other',
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
];
