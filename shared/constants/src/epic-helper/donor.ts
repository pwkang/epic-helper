export const DONOR_TIER = {
  normie: 'normie',
  epic: 'epic',
  super: 'super',
  mega: 'mega',
  hyper: 'hyper',
  ultra: 'ultra',
  ultimate: 'ultimate',
  insane: 'insane',
} as const;

export const DONOR_TOKEN_AMOUNT = {
  normie: 1,
  epic: 2,
  super: 6,
  mega: 12,
  hyper: 30,
  ultra: 60,
  ultimate: 500,
  insane: 1000,
} as const;

export const DONOR_TIER_ID = {
  normie: '6881102',
  epic: '7368499',
  super: '7368500',
  mega: '7368502',
  hyper: '7368505',
  ultra: '7368515',
  ultimate: '8364342',
  insane: '8364343',
} as const;

export const USERS_PER_TOKEN = 100;

export const TOKENS_REQUIRED = {
  ttVerification: 12,
  enchantMute: 5,
} as const;

export const MAX_ENCHANT_MUTE_CHANNELS = 3;
