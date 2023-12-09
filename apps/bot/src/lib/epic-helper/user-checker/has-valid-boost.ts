import {donorService, freeDonorService, serverService} from '@epic-helper/services';
import {DONOR_TOKEN_AMOUNT} from '@epic-helper/constants';

export const _hasValidBoost = async (userId: string) => {
  const donor = await donorService.findDonor({
    discordUserId: userId,
  });
  const freeDonor = await freeDonorService.findFreeDonor({
    discordUserId: userId,
  });
  const donorToken = donor?.tier ? DONOR_TOKEN_AMOUNT[donor.tier] : 0;
  const freeDonorToken = freeDonor?.token || 0;
  const totalTokens = donorToken + freeDonorToken;
  const boostedServers = await serverService.getUserBoostedServers({
    userId,
  });
  const boostedServersTokens = boostedServers.reduce(
    (acc, server) => acc + server.token,
    0,
  );
  return totalTokens >= boostedServersTokens;
};
