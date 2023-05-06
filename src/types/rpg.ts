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

export const RPG_PET_TYPE = {
  cat: 'cat',
  dog: 'dog',
  dragon: 'dragon',
  pumpkinBat: 'Pumpkin Bat',
  hamster: 'Hamster',
  pinkFish: 'Pink Fish',
  snowball: 'Snowball',
  pony: 'Pony',
  goldenBunny: 'Golden Bunny',
  penguin: 'Penguin',
  snowman: 'Snowman',
  epicPanda: 'Epic Panda',
  voidDog: 'VoiDog',
} as const;

export const RPG_PET_SKILL = {
  fast: 'Fast',
  happy: 'Happy',
  clever: 'Clever',
  digger: 'Digger',
  lucky: 'Lucky',
  timeTraveler: 'Time Traveler',
  epic: 'EPIC',
  ascended: 'ASCENDED',
  fighter: 'FIGHTER',
  perfect: 'PERFECT',
};

export const RPG_SPECIAL_PET_SKILL = {
  pinkFish: 'Fisherfish',
  pumpkinBat: 'Monster Hunter',
  hamster: 'BOOSTER',
  snowball: 'Gifter',
  snowman: 'Gifter',
  goldenBunny: 'Faster',
  pony: 'Farmer',
  epicPanda: 'Competitive',
  penguin: 'Antarctician',
} as const;
