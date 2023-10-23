import type {ValuesOf} from '../type';

export const USER_STATS_RPG_COMMAND_TYPE = {
  lootbox: 'lootbox',
  hunt: 'hunt',
  huntTogether: 'huntTogether',
  adventure: 'adventure',
  training: 'training',
  ultraining: 'ultraining',
  quest: 'quest',
  epicQuest: 'epicQuest',
  working: 'working',
  farm: 'farm',
} as const;

export interface IUserStats {
  userId: string;
  statsAt: Date;
  rpg: Record<ValuesOf<typeof USER_STATS_RPG_COMMAND_TYPE>, number>;
}
