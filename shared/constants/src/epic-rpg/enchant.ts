import {ValuesOf} from '../type';

export const RPG_ENCHANT_LEVEL = {
  normie: 'normie',
  good: 'good',
  great: 'great',
  mega: 'mega',
  epic: 'epic',
  hyper: 'hyper',
  ultimate: 'ultimate',
  perfect: 'perfect',
  edgy: 'edgy',
  'ultra-edgy': 'ultra-edgy',
  omega: 'omega',
  'ultra-omega': 'ultra-omega',
  godly: 'godly',
  void: 'void',
} as const;

type IRpgEnchantLevelRank = Record<ValuesOf<typeof RPG_ENCHANT_LEVEL>, number>;

export const RPG_ENCHANT_LEVEL_RANK: IRpgEnchantLevelRank = {
  normie: 1,
  good: 2,
  great: 3,
  mega: 4,
  epic: 5,
  hyper: 6,
  ultimate: 7,
  perfect: 8,
  edgy: 9,
  'ultra-edgy': 10,
  omega: 11,
  'ultra-omega': 12,
  godly: 13,
  void: 14,
} as const;
