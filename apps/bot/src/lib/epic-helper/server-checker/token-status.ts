import type {Client} from 'discord.js';
import {serverService} from '../../../services/database/server.service';
import {userChecker} from '../user-checker';
import {djsServerHelper} from '../../discordjs/server';
import {djsMemberHelper} from '../../discordjs/member';
import {USERS_PER_TOKEN} from '@epic-helper/constants';

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

  await djsMemberHelper.fetchAll({serverId, client});

  const roles = serverAccount?.donor?.roles ?? [];

  const usersWithRole = new Set<string>();
  for (const role of roles) {
    const roleUsers =
      server?.roles.cache.get(role)?.members.map((member) => member.id) ?? [];
    for (const user of roleUsers) usersWithRole.add(user);
  }

  const activeUsersCount = serverAccount?.donor.roles?.length
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
      activeUsersCount <= maxAvailableUsers &&
      invalidBoosters.length === 0,
    usersWithRoleCount: usersWithRole.size,
    activeUsersCount,
    maxAvailableUsers,
    totalTokens,
    totalValidTokens,
    invalidBoosters,
    validBoosters,
    donorRoles: roles,
  };
};
