export const RPG_PET_TYPE_BASIC = {
  cat: 'cat',
  dog: 'dog',
  dragon: 'dragon',
} as const;

export const RPG_PET_TYPE_EVENT = {
  pumpkinBat: 'pumpkinBat',
  hamster: 'hamster',
  pinkFish: 'pinkFish',
  snowball: 'snowball',
  pony: 'pony',
  goldenBunny: 'goldenBunny',
  penguin: 'penguin',
  snowman: 'snowman',
  epicPanda: 'epicPanda',
  voiDog: 'voiDog',
  worker: 'worker',
} as const;

export const RPG_PET_TYPE_INVENTORY = {
  bunny: 'bunny',
  fakeGoldenBunny: 'fakeGoldenBunny',
} as const;

export const RPG_PET_TYPE = {
  ...RPG_PET_TYPE_BASIC,
  ...RPG_PET_TYPE_EVENT,
  ...RPG_PET_TYPE_INVENTORY,
} as const;

export const RPG_PET_TYPE_WILD = {
  cat: RPG_PET_TYPE.cat,
  dog: RPG_PET_TYPE.dog,
  dragon: RPG_PET_TYPE.dragon,
  bunny: RPG_PET_TYPE.bunny,
  fakeGoldenBunny: RPG_PET_TYPE.fakeGoldenBunny,
} as const;

export const RPG_PET_LABEL = {
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
  worker: 'Worker',
  bunny: 'Bunny',
  fakeGoldenBunny: 'Fake golden bunny',
};

export const RPG_PET_SKILL_ASCEND = {
  normie: 'normie',
  fast: 'fast',
  happy: 'happy',
  clever: 'clever',
  digger: 'digger',
  lucky: 'lucky',
  timeTraveler: 'timeTraveler',
  epic: 'epic',
} as const;

export const RPG_PET_SKILL_SPECIAL = {
  ascended: 'ascended',
  perfect: 'perfect',
  fighter: 'fighter',
  master: 'master',
};

export const RPG_PET_SKILL_EVENT = {
  pinkFish: 'fisherfish',
  pumpkinBat: 'monsterHunter',
  hamster: 'booster',
  snowball: 'gifter',
  snowman: 'gifter',
  goldenBunny: 'faster',
  pony: 'farmer',
  epicPanda: 'competitive',
  penguin: 'antarctician',
  worker: 'leader',
  voiDog: 'resetter',
} as const;

export const RPG_PET_SKILL = {
  ...RPG_PET_SKILL_ASCEND,
  ...RPG_PET_SKILL_SPECIAL,
  ...RPG_PET_SKILL_EVENT,
} as const;

export const RPG_PET_SKILL_LABEL = {
  normie: 'Normie',
  fast: 'Fast',
  happy: 'Happy',
  clever: 'Clever',
  digger: 'Digger',
  lucky: 'Lucky',
  timeTraveler: 'Time traveler',
  epic: 'EPIC',
  ascended: 'ASCENDED',
  perfect: 'PERFECT',
  fighter: 'FIGHTER',
  master: 'MASTER',
  fisherfish: 'Fisherfish',
  monsterHunter: 'Monster Hunter',
  booster: 'BOOSTER',
  gifter: 'Gifter',
  faster: 'Faster',
  farmer: 'Farmer',
  competitive: 'Competitive',
  antarctician: 'Antarctician',
  leader: 'Leader',
  resetter: 'Resetter',
};

export const RPG_PET_ADV_STATUS = {
  idle: 'idle',
  adventure: 'adventure',
  back: 'back',
} as const;

export type TSkillTierStr = 'f' | 'e' | 'd' | 'c' | 'b' | 'a' | 's' | 'ss' | 'ss+';
export type TSkillTierNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

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

export const RPG_PET_THUMBNAIL = {
  cat: 'https://cdn.discordapp.com/emojis/703150997517893692.png?v=1',
  dog: 'https://cdn.discordapp.com/emojis/703152291540369450.png?v=1',
  dragon: 'https://cdn.discordapp.com/emojis/705963075576135691.png?v=1',
  bunny: 'https://cdn.discordapp.com/emojis/690094269125361672.png?v=1',
  fakeGoldenBunny: 'https://cdn.discordapp.com/emojis/690840027420295248.webp?size=44',
} as const;
