import {BaseMessageOptions, Guild} from 'discord.js';
import {serverService} from '../../../../services/database/server.service';
import {IServer} from '@epic-helper/models';
import {_getServerAdminEmbed} from './embed/server-admin-embed';
import {_getServerAdminRoleEmbed} from './embed/server-admin-role-embed';

interface IServerAdminRole {
  server: Guild;
}

interface IAddAdminRole {
  roleId: string;
}

interface IRemoveAdminRole {
  roleId: string;
}

export const _serverAdminRole = async ({server}: IServerAdminRole) => {
  const render = (serverAccount: IServer): BaseMessageOptions => {
    return {
      embeds: [_getServerAdminRoleEmbed({serverAccount, guild: server})],
    };
  };

  const addRole = async ({roleId}: IAddAdminRole) => {
    const serverAccount = await serverService.addServerAdminRoles({
      serverId: server.id,
      rolesId: [roleId],
    });
    if (!serverAccount) return;
    return render(serverAccount);
  };

  const removeRole = async ({roleId}: IRemoveAdminRole) => {
    const serverAccount = await serverService.removeServerAdminRoles({
      serverId: server.id,
      rolesId: [roleId],
    });
    if (!serverAccount) return;
    return render(serverAccount);
  };

  const reset = async () => {
    const serverAccount = await serverService.clearServerAdminRoles({
      serverId: server.id,
    });
    if (!serverAccount) return;
    return render(serverAccount);
  };

  return {
    addRole,
    removeRole,
    reset,
  };
};
