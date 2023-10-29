import type {IDonor} from '@epic-helper/models';

export const toDonor = (donor: IDonor): IDonor => {
  return {
    tier: donor.tier,
    expiresAt: donor.expiresAt ? new Date(donor.expiresAt) : new Date(),
    discord: {
      userId: donor.discord.userId,
      username: donor.discord.username,
    },
    patreon: {
      email: donor.patreon.email,
      userId: donor.patreon.userId,
      fullName: donor.patreon.fullName,
      memberId: donor.patreon.memberId,
    },
  };
};

export const toDonors = (donors: any[]): IDonor[] => {
  return donors.map(toDonor);
};
