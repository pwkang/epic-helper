import ms from 'ms';

export const BOT_REMINDER_BASE_COOLDOWN = {
  daily: ms('1d') - ms('10m'),
  weekly: ms('1w') - ms('10m'),
  lootbox: ms('3h'),
  cardHand: ms('1d'),
  hunt: ms('1m'),
  adventure: ms('1h'),
  training: ms('15m'),
  duel: ms('2h'),
  quest: {
    accepted: ms('6h'),
    declined: ms('1h'),
  },
  epicQuest: ms('6h'),
  working: ms('5m'),
  farm: ms('10m'),
  horse: ms('1d'),
  arena: ms('12h'),
  dungeon: ms('12h'),
  epicItem: ms('30m'),
  xmasChimney: ms('3h'),
} as const;
