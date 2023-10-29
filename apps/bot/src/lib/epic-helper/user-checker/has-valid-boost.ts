import donorService from '../../../services/database/donor.service';
import freeDonorService from '../../../services/database/free-donor.service';
import {DONOR_TOKEN_AMOUNT} from '@epic-helper/constants';
import {serverService} from '../../../services/database/server.service';

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
