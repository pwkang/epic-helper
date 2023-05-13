export const RPG_COMMAND_TYPE = {
  daily: 'daily',
  weekly: 'weekly',
  lootbox: 'lootbox',
  vote: 'vote',
  hunt: 'hunt',
  adventure: 'adventure',
  training: 'training',
  duel: 'duel',
  quest: 'quest',
  working: 'working',
  farm: 'farm',
  horse: 'horse',
  arena: 'arena',
  dungeon: 'dungeon',
  use: 'use',
  pet: 'pet',
} as const;

export const RPG_WORKING_TYPE = {
  fish: 'fish',
  net: 'net',
  boat: 'boat',
  bigboat: 'bigboat',
  chop: 'chop',
  axe: 'axe',
  bowsaw: 'bowsaw',
  chainsaw: 'chainsaw',
  mine: 'mine',
  pickaxe: 'pickaxe',
  drill: 'drill',
  dynamite: 'dynamite',
} as const;

export const RPG_FARM_SEED = {
  seed: null,
  carrot: 'carrot',
  potato: 'potato',
} as const;
