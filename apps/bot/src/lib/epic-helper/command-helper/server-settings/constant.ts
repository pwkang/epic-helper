export const SERVER_SETTINGS_SELECT_MENU_ID = 'page-type';
export const SERVER_SETTINGS_PAGE_TYPE = {
  randomEvent: 'randomEvent',
  enchantMute: 'enchantMute',
} as const;

interface IPage {
  id: ValuesOf<typeof SERVER_SETTINGS_PAGE_TYPE>;
  label: string;
}

export const SERVER_SETTINGS_PAGES: IPage[] = [
  {
    id: SERVER_SETTINGS_PAGE_TYPE.randomEvent,
    label: 'Random event',
  },
  {
    id: SERVER_SETTINGS_PAGE_TYPE.enchantMute,
    label: 'Enchant mute',
  },
];
