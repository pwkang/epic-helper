export const RPG_RANDOM_EVENTS = {
  log: 'log',
  fish: 'fish',
  coin: 'coin',
  lootbox: 'lootbox',
  boss: 'boss',
  arena: 'arena',
  miniboss: 'miniboss',
  santevil: 'santevil',
} as const;

export const RPG_RANDOM_EVENTS_NAME: Record<
  keyof typeof RPG_RANDOM_EVENTS,
  string
> = {
  log: 'Epic Tree',
  fish: 'Megalodon',
  coin: 'Raining Coins',
  lootbox: 'Lootbox',
  boss: 'Legendary Boss',
  arena: 'Arena',
  miniboss: 'Miniboss',
  santevil: 'SANTEVIL',
} as const;

export const RPG_RANDOM_EVENTS_COMMAND: Record<
  keyof typeof RPG_RANDOM_EVENTS,
  string
> = {
  log: 'Cut',
  fish: 'Lure',
  coin: 'Catch',
  lootbox: 'Summon',
  boss: 'Time To Fight',
  arena: 'Join',
  miniboss: 'Fight',
  santevil: 'HO HO HO',
} as const;
