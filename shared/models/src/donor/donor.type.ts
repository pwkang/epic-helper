import type {DONOR_TIER} from '@epic-helper/constants';
import type {ValuesOf} from '@epic-helper/types';

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
  active: boolean;
}
