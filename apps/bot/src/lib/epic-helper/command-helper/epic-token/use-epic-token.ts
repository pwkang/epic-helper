import {donorService, freeDonorService, serverService} from '@epic-helper/services';
import {DONOR_TOKEN_AMOUNT} from '@epic-helper/constants';
import type {BaseMessageOptions} from 'discord.js';

interface IUseEpicToken {
  userId: string;
  serverId: string;
  token: number;
}

export const _useEpicToken = async ({
  token,
  userId,
  serverId,
}: IUseEpicToken): Promise<BaseMessageOptions> => {
  const freeDonor = await freeDonorService.findFreeDonor({
    discordUserId: userId,
  });
  const freeDonorTokens = freeDonor?.token ?? 0;
  const donor = await donorService.findDonor({
    discordUserId: userId,
  });
  const donorTokens = donor?.tier ? DONOR_TOKEN_AMOUNT[donor.tier] : 0;
  const boosted = await serverService.getUserBoostedServers({
    userId,
  });
  const totalTokens = freeDonorTokens + donorTokens;
  const usedTokens = boosted.reduce((acc, curr) => acc + curr.token, 0);
  const remainingTokens = totalTokens - usedTokens;
  if (totalTokens === 0) {
    return {
      content: 'You don\'t have any tokens to boost servers.',
    };
  }
  if (remainingTokens < token) {
    return {
      content: `You don't have enough tokens. You have ${remainingTokens} tokens left.`,
    };
  }
  await serverService.addTokens({
    amount: token,
    serverId,
    userId,
  });
  return {
    content: `You have successfully added ${token} tokens to this server.`,
  };
};
