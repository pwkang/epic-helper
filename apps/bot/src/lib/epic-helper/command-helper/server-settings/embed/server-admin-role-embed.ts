import {IServerSettings} from '../type';
import {EmbedBuilder} from 'discord.js';
import {BOT_COLOR} from '@epic-helper/constants';
import messageFormatter from '../../../../discordjs/message-formatter';

export const _getServerAdminRoleEmbed = ({serverAccount, guild}: IServerSettings) => {
  const roles = serverAccount?.settings.admin.rolesId ?? [];
  return new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setAuthor({
      name: `${guild.name}'s admin roles`,
      iconURL: guild.iconURL() ?? undefined,
    })
    .addFields({
      name: 'Roles',
      value: roles.length ? roles.map(messageFormatter.role).join('\n') : '-',
    });
};
