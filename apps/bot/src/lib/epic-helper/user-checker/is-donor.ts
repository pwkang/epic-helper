import donorService from '../../../services/database/donor.service';
import freeDonorService from '../../../services/database/free-donor.service';
import {serverChecker} from '../server-checker';
import type {Client} from 'discord.js';
import {djsMemberHelper} from '../../discordjs/member';

interface IIsDonor {
  userId: string;
  serverId: string;
  client: Client;
}

export const _isDonor = async ({userId, client, serverId}: IIsDonor) => {
  const donor = await donorService.findDonor({
    discordUserId: userId,
  });

  const isDonor = donor?.active || (!!donor?.expiresAt && new Date() < donor?.expiresAt);

  const freeDonor = await freeDonorService.findFreeDonor({
    discordUserId: userId,
  });
  const isFreeDonor =
    !!freeDonor?.expiresAt && freeDonor?.expiresAt.getTime() > Date.now();

  const member = await djsMemberHelper.getMember({
    client,
    serverId,
    userId,
  });

  const serverStatus = await serverChecker.getTokenStatus({
    serverId,
    client,
  });

  const shouldEnjoyServerPerks =
    serverStatus.isValid &&
    !!member?.roles.cache.hasAny(...serverStatus.donorRoles);

  return isDonor || isFreeDonor || shouldEnjoyServerPerks;
};
