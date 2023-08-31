import {Client, Guild, PermissionsBitField} from 'discord.js';
import {djsMemberHelper} from '../../discordjs/member';
import {serverService} from '../../../services/database/server.service';

interface IIsServerAdmin {
  client: Client;
  server: Guild;
  userId: string;
}

const PERMISSIONS = [
  PermissionsBitField.Flags.ManageGuild,
  PermissionsBitField.Flags.Administrator,
];

export const _isServerAdmin = async ({server, client, userId}: IIsServerAdmin) => {
  const member = await djsMemberHelper.getMember({
    client,
    serverId: server.id,
    userId,
  });
  if (!member) return false;
  const hasPermission = member.permissions.any(PERMISSIONS);
  if (hasPermission) return true;
  const serverAccount = await serverService.findServerById(server.id);
  if (!serverAccount) return false;
  const memberRoles = member.roles.cache.map((role) => role.id);
  return (
    serverAccount.settings.admin.rolesId.some((roleId) => memberRoles.includes(roleId)) ||
    serverAccount.settings.admin.usersId.includes(userId)
  );
};
