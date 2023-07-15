import {DONOR_TIER} from '@epic-helper/constants';
import {ValuesOf} from '../type';

export interface IBoostedGuild {
  guildId: string;
  token: number;
}

export interface IDonor {
  patreon: {
    email?: string;
    fullName?: string;
    userId: string;
    memberId?: string;
  };
  discord: {
    userId?: string;
    username?: string;
  };
  tier?: ValuesOf<typeof DONOR_TIER>;
  expiresAt: Date;
  boostedGuilds: IBoostedGuild[];
}
