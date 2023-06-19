import {ValuesOf} from '../type';

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

export const RPG_AREA = {
  a0: 0,
  a1: 1,
  a2: 2,
  a3: 3,
  a4: 4,
  a5: 5,
  a6: 6,
  a7: 7,
  a8: 8,
  a9: 9,
  a10: 10,
  a11: 11,
  a12: 12,
  a13: 13,
  a14: 14,
  a15: 15,
  top: 'top',
  a16: 16,
  a17: 17,
  a18: 18,
  a19: 19,
  a20: 20,
} as const;

type RpgArea = ValuesOf<typeof RPG_AREA>;

type ITradeRate = {
  [key in RpgArea]: {
    tradeA?: number;
    tradeB?: number;
    tradeC?: number;
    tradeD?: number;
    tradeE?: number;
    tradeF?: number;
  };
};

export const RPG_TRADE_RATE: ITradeRate = {
  [RPG_AREA.a0]: {},
  [RPG_AREA.a1]: {
    tradeA: 1,
    tradeB: 1,
  },
  [RPG_AREA.a2]: {
    tradeA: 1,
    tradeB: 1,
  },
  [RPG_AREA.a3]: {
    tradeA: 1,
    tradeB: 1,
    tradeC: 3,
    tradeD: 1 / 3,
  },
  [RPG_AREA.a4]: {
    tradeA: 2,
    tradeB: 1 / 2,
    tradeC: 4,
    tradeD: 1 / 4,
  },
  [RPG_AREA.a5]: {
    tradeA: 2,
    tradeB: 1 / 2,
    tradeC: 4,
    tradeD: 1 / 4,
    tradeE: 450,
    tradeF: 1 / 450,
  },
  [RPG_AREA.a6]: {
    tradeA: 3,
    tradeB: 1 / 3,
    tradeC: 15,
    tradeD: 1 / 15,
    tradeE: 675,
    tradeF: 1 / 675,
  },
  [RPG_AREA.a7]: {
    tradeA: 3,
    tradeB: 1 / 3,
    tradeC: 15,
    tradeD: 1 / 15,
    tradeE: 675,
    tradeF: 1 / 675,
  },
  [RPG_AREA.a8]: {
    tradeA: 3,
    tradeB: 1 / 3,
    tradeC: 8,
    tradeD: 1 / 8,
    tradeE: 675,
    tradeF: 1 / 675,
  },
  [RPG_AREA.a9]: {
    tradeA: 2,
    tradeB: 1 / 2,
    tradeC: 12,
    tradeD: 1 / 12,
    tradeE: 850,
    tradeF: 1 / 850,
  },
  [RPG_AREA.a10]: {
    tradeA: 3,
    tradeB: 1 / 3,
    tradeC: 12,
    tradeD: 1 / 12,
    tradeE: 500,
    tradeF: 1 / 500,
  },
  [RPG_AREA.a11]: {
    tradeA: 3,
    tradeB: 1 / 3,
    tradeC: 8,
    tradeD: 1 / 8,
    tradeE: 500,
    tradeF: 1 / 500,
  },
  [RPG_AREA.a12]: {
    tradeA: 3,
    tradeB: 1 / 3,
    tradeC: 8,
    tradeD: 1 / 8,
    tradeE: 350,
    tradeF: 1 / 350,
  },
  [RPG_AREA.a13]: {
    tradeA: 3,
    tradeB: 1 / 3,
    tradeC: 8,
    tradeD: 1 / 8,
    tradeE: 350,
    tradeF: 1 / 350,
  },
  [RPG_AREA.a14]: {
    tradeA: 3,
    tradeB: 1 / 3,
    tradeC: 8,
    tradeD: 1 / 8,
    tradeE: 350,
    tradeF: 1 / 350,
  },
  [RPG_AREA.a15]: {
    tradeA: 3,
    tradeB: 1 / 3,
    tradeC: 8,
    tradeD: 1 / 8,
    tradeE: 350,
    tradeF: 1 / 350,
  },
  [RPG_AREA.top]: {
    tradeA: 2,
    tradeB: 1 / 2,
    tradeC: 4,
    tradeD: 1 / 4,
    tradeE: 250,
    tradeF: 1 / 250,
  },
  [RPG_AREA.a16]: {
    tradeA: 2,
    tradeB: 1 / 2,
    tradeC: 4,
    tradeD: 1 / 4,
    tradeE: 250,
    tradeF: 1 / 250,
  },
  [RPG_AREA.a17]: {
    tradeA: 2,
    tradeB: 1 / 2,
    tradeC: 4,
    tradeD: 1 / 4,
    tradeE: 250,
    tradeF: 1 / 250,
  },
  [RPG_AREA.a18]: {
    tradeA: 2,
    tradeB: 1 / 2,
    tradeC: 4,
    tradeD: 1 / 4,
    tradeE: 250,
    tradeF: 1 / 250,
  },
  [RPG_AREA.a19]: {
    tradeA: 2,
    tradeB: 1 / 2,
    tradeC: 4,
    tradeD: 1 / 4,
    tradeE: 250,
    tradeF: 1 / 250,
  },
  [RPG_AREA.a20]: {
    tradeA: 2,
    tradeB: 1 / 2,
    tradeC: 4,
    tradeD: 1 / 4,
    tradeE: 250,
    tradeF: 1 / 250,
  },
};

export const RPG_STT_SCORE = {
  level: 0.5,
  stats: 0.4,
  commonLootbox: 0.05,
  uncommonLootbox: 0.1,
  rareLootbox: 0.133,
  epicLootbox: 0.2,
  edgyLootbox: 0.25,
  omegaLootbox: 5,
  godlyLootbox: 50,
  lifePotion: 1 / 500000,
  lotteryTicket: 0.5,
  ruby: 1 / 25,
  ultimateLog: 40,
  watermelon: 1 / 12,
  superFish: 1 / 8,
  bread: 1 / 25,
  carrot: 1 / 30,
  potato: 1 / 35,
  seed: 1 / 2500,
  breadSeed: 1,
  carrotSeed: 1,
  potatoSeed: 1,
  darkEnergy: 15 / 20,
  dragonScale: 10 / 20,
  chip: 5 / 20,
  mermaidHair: 4 / 20,
  unicornHorn: 3 / 20,
  zombieEye: 2 / 20,
  wolfSkin: 1 / 20,
} as const;

export const RPG_DONOR_CD_REDUCTION = {
  nonDonor: 1,
  donor10: 0.9,
  donor20: 0.8,
  donor35: 0.65,
} as const;

export const RPG_DONOR_TIER = {
  nonDonor: 'nonDonor',
  donor10: 'donor10',
  donor20: 'donor20',
  donor35: 'donor35',
} as const;