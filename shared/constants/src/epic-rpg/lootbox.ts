export const RPG_LOOTBOX_TYPE = {
  common: 'common',
  uncommon: 'uncommon',
  rare: 'rare',
  epic: 'epic',
  edgy: 'edgy',
  omega: 'omega',
  godly: 'godly',
} as const;

export const RPG_LOOTBOX_ABBREVIATION = {
  common: ['c', 'co', 'common'],
  uncommon: ['u', 'un', 'uncommon'],
  rare: ['r', 'ra', 'rare'],
  epic: ['ep', 'epic'],
  edgy: ['ed', 'edgy'],
  omega: ['o', 'om', 'omega'],
  godly: ['g', 'go', 'godly'],
} as const;
