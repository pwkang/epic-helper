import type {Client} from 'discord.js';
import {serverService} from '../../../../services/database/server.service';
import {djsServerHelper} from '../../../discordjs/server';
import commandHelper from '../index';
import {SERVER_SETTINGS_PAGE_TYPE} from './constant';

interface IServerDonorRoleSettings {
  serverId: string;
  client: Client;
}

export const _serverDonorRoleSettings = async ({
  serverId,
  client,
}: IServerDonorRoleSettings) => {
  const serverAccount = await serverService.getServer({
    serverId,
  });
  const server = await djsServerHelper.getServer({
    serverId,
    client,
  });

  const addRoles = async (rolesId: string[]) => {
    if (!server || !serverAccount) return;
    const rolesToAdd = rolesId.filter(
      (roleId) =>
        !serverAccount.donor.roles.includes(roleId) &&
        server.roles.cache.has(roleId),
    );

    await serverService.addDonorRoles({
      serverId,
      rolesId: rolesToAdd,
    });
    return render();
  };

  const removeRoles = async (rolesId: string[]) => {
    if (!server || !serverAccount) return;
    const rolesToRemove = rolesId.filter((roleId) =>
      serverAccount.donor.roles.includes(roleId),
    );

    await serverService.removeDonorRoles({
      serverId,
      rolesId: rolesToRemove,
    });
    return render();
  };

  const clear = async () => {
    if (!server || !serverAccount) return;
    await serverService.clearDonorRoles({
      serverId,
    });
    return render();
  };

  const render = async () => {
    if (!server) return;
    const serverSettings = await commandHelper.serverSettings.settings({
      server,
      client,
    });
    if (!serverSettings) return {};
    return serverSettings.render({
      type: SERVER_SETTINGS_PAGE_TYPE.tokenBoosts,
      displayOnly: true,
    });
  };

  return {
    addRoles,
    removeRoles,
    clear,
  };
};
