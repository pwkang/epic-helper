import type {Client} from 'discord.js';
import {userChecker} from '../user-checker';
import {djsServerHelper} from '../../discordjs/server';
import {djsMemberHelper} from '../../discordjs/member';
import {USERS_PER_TOKEN} from '@epic-helper/constants';
import {serverService} from '@epic-helper/services';

interface IHasEnoughTokens {
  client: Client;
  serverId: string;
}

interface IBooster {
  userId: string;
  tokens: number;
}

export const _getTokenStatus = async ({client, serverId}: IHasEnoughTokens) => {
  const serverAccount = await serverService.getServer({
    serverId,
  });
  const server = await djsServerHelper.getServer({
    serverId,
    client,
  });

  const boostedUsers = serverAccount?.tokens ?? [];
  const totalTokens =
    serverAccount?.tokens?.reduce((acc, curr) => acc + curr.amount, 0) ?? 0;

  if (totalTokens)
    await djsMemberHelper.fetchAll({serverId, client});

  const totalMembers =
    server?.members?.cache.filter((user) => !user.user.bot).size ?? 0;
  const roles = serverAccount?.donor?.roles ?? [];

  const usersWithRole = new Set<string>();
  for (const role of roles) {
    const roleUsers =
      server?.roles.cache.get(role)?.members.map((member) => member.id) ?? [];
    for (const user of roleUsers) usersWithRole.add(user);
  }

  const beneficiaryUsersCount = serverAccount?.donor.roles?.length
    ? usersWithRole.size
    : server?.members.cache.filter((member) => !member.user.bot).size ?? 0;

  const invalidBoosters: IBooster[] = [];
  const validBoosters: IBooster[] = [];
  for (const user of boostedUsers) {
    const isValid = await userChecker.hasValidBoost(user.userId);
    if (isValid)
      validBoosters.push({
        userId: user.userId,
        tokens: user.amount,
      });
    else
      invalidBoosters.push({
        userId: user.userId,
        tokens: user.amount,
      });
  }

  invalidBoosters.sort((a, b) => b.tokens - a.tokens);
  validBoosters.sort((a, b) => b.tokens - a.tokens);

  const maxAvailableUsers = totalTokens * USERS_PER_TOKEN;

  const totalValidTokens = validBoosters.reduce(
    (acc, curr) => acc + curr.tokens,
    0,
  );

  return {
    isValid:
      !!server &&
      beneficiaryUsersCount <= maxAvailableUsers &&
      invalidBoosters.length === 0,
    totalMembers,
    beneficiaryUsersCount,
    maxAvailableUsers,
    totalValidTokens,
    invalidBoosters,
    validBoosters,
    donorRoles: roles,
  };
};
