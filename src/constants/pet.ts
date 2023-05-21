export const RPG_PET_TYPE = {
  cat: 'cat',
  dog: 'dog',
  dragon: 'dragon',
  pumpkinBat: 'Pumpkin bat',
  hamster: 'Hamster',
  pinkFish: 'Pink fish',
  snowball: 'Snowball',
  pony: 'Pony',
  goldenBunny: 'Golden bunny',
  penguin: 'Penguin',
  snowman: 'Snowman',
  epicPanda: 'Epic panda',
  voidDog: 'VoiDog',
} as const;

export const RPG_PET_SKILL = {
  fast: 'Fast',
  happy: 'Happy',
  clever: 'Clever',
  digger: 'Digger',
  lucky: 'Lucky',
  timeTraveler: 'Time traveler',
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

export const RPG_PET_STATUS = {
  idle: 'idle',
  adventure: 'adventure',
  back: 'back',
} as const;

export const RPG_PET_SKILL_TIER = {
  f: 1,
  e: 2,
  d: 3,
  c: 4,
  b: 5,
  a: 6,
  s: 7,
  ss: 8,
  'ss+': 9,
} as const;
