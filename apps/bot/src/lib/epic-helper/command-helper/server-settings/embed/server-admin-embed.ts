import type {IServerSettings} from '../type';
import {EmbedBuilder} from 'discord.js';
import {BOT_COLOR} from '@epic-helper/constants';
import messageFormatter from '../../../../discordjs/message-formatter';

export const _getServerAdminEmbed = ({
  serverAccount,
  guild
}: IServerSettings) => {
  const admins = serverAccount?.settings.admin.usersId ?? [];

  return new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setAuthor({
      name: `${guild.name}'s admins`,
      iconURL: guild.iconURL() ?? undefined
    })
    .addFields({
      name: 'Admins',
      value: admins.length ? admins.map(messageFormatter.user).join('\n') : '-'
    });
};
