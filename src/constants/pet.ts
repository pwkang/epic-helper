export const RPG_PET_TYPE = {
  cat: 'Cat',
  dog: 'Dog',
  dragon: 'Dragon',
  pumpkinBat: 'Pumpkin bat',
  hamster: 'Hamster',
  pinkFish: 'Pink fish',
  snowball: 'Snowball',
  pony: 'Pony',
  goldenBunny: 'Golden bunny',
  penguin: 'Penguin',
  snowman: 'Snowman',
  epicPanda: 'Epic panda',
  voiDog: 'VoiDog',
} as const;

export const RPG_PET_SKILL = {
  normie: 'Normie',
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
  master: 'MASTER',
} as const;

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

type TSkillTierStr = 'f' | 'e' | 'd' | 'c' | 'b' | 'a' | 's' | 'ss' | 'ss+';
type TSkillTierNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const RPG_PET_SKILL_TIER: Record<TSkillTierStr, TSkillTierNumber> = {
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

export const RPG_PET_SKILL_TIER_REVERSE: Record<TSkillTierNumber, TSkillTierStr> = {
  1: 'f',
  2: 'e',
  3: 'd',
  4: 'c',
  5: 'b',
  6: 'a',
  7: 's',
  8: 'ss',
  9: 'ss+',
} as const;
