import {donorService} from '@epic-helper/services';
import {PATREON_PATRON_STATUS, patreonApi} from '@epic-helper/libs';

export const updatePatrons = async () => {
  const patrons = await patreonApi.getPatrons();
  await donorService.registerDonors(
    patrons.map((patron) => ({
      discord: {
        userId: patron.discord.userId,
      },
      patreon: {
        email: patron.patreon.email,
        userId: patron.patreon.userId,
        memberId: patron.patreon.memberId,
        fullName: patron.patreon.fullName,
      },
      tier: patron.currentTier,
      expiresAt: patron.subscription.nextChargeDate,
      active: patron.subscription.patronStatus === PATREON_PATRON_STATUS.activePatron,
    })),
  );
};
