import type {BaseMessageOptions, Guild} from 'discord.js';
import {serverService} from '../../../../services/database/server.service';
import type {IServer} from '@epic-helper/models';
import {_getServerAdminEmbed} from './embed/server-admin-embed';

interface IServerAdmin {
  server: Guild;
}

interface IAddAdmin {
  userId: string;
}

interface IRemoveAdmin {
  userId: string;
}

export const _serverAdmin = async ({server}: IServerAdmin) => {
  const render = (serverAccount: IServer): BaseMessageOptions => {
    return {
      embeds: [_getServerAdminEmbed({serverAccount, guild: server})],
    };
  };

  const addAdmin = async ({userId}: IAddAdmin) => {
    const serverAccount = await serverService.addServerAdmins({
      serverId: server.id,
      usersId: [userId],
    });
    if (!serverAccount) return;
    return render(serverAccount);
  };

  const removeAdmin = async ({userId}: IRemoveAdmin) => {
    const serverAccount = await serverService.removeServerAdmins({
      serverId: server.id,
      usersId: [userId],
    });
    if (!serverAccount) return;
    return render(serverAccount);
  };

  const reset = async () => {
    const serverAccount = await serverService.clearServerAdmins({
      serverId: server.id,
    });
    if (!serverAccount) return;
    return render(serverAccount);
  };

  return {
    addAdmin,
    removeAdmin,
    reset,
  };
};
