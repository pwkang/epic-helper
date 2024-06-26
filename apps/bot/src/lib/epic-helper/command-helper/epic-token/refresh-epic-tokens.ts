import {donorService, freeDonorService, serverService} from '@epic-helper/services';
import {DONOR_TOKEN_AMOUNT} from '@epic-helper/constants';

interface ISyncBoostedServers {
  userId: string;
}

interface IServerToUnBoost {
  serverId: string;
  token: number;
}

export const _syncBoostedServers = async ({userId}: ISyncBoostedServers) => {
  const donor = await donorService.findDonor({
    discordUserId: userId,
  });
  const freeDonor = await freeDonorService.findFreeDonor({
    discordUserId: userId,
  });
  const boostedServers = await serverService.getUserBoostedServers({
    userId,
  });
  const donorToken = donor?.tier ? DONOR_TOKEN_AMOUNT[donor.tier] : 0;
  const freeToken = freeDonor?.token ?? 0;
  const totalToken = donorToken + freeToken;
  const usedToken = boostedServers.reduce(
    (acc, server) => acc + server.token,
    0,
  );

  if (totalToken > usedToken) return;

  let extraTokens = usedToken - totalToken;
  const serversToUnBoost: IServerToUnBoost[] = [];
  for (const server of boostedServers) {
    if (extraTokens <= 0) break;
    if (server.token <= extraTokens) {
      serversToUnBoost.push({
        serverId: server.serverId,
        token: server.token,
      });
      extraTokens -= server.token;
    } else {
      serversToUnBoost.push({
        serverId: server.serverId,
        token: extraTokens,
      });
      extraTokens = 0;
    }
  }
  for (const server of serversToUnBoost) {
    await serverService.removeTokens({
      serverId: server.serverId,
      userId,
      tokens: server.token,
    });
  }
};
