import {Client, Collection, EmbedBuilder, Guild, GuildMember, Role} from 'discord.js';
import {guildService} from '../../../../services/database/guild.service';
import {djsMemberHelper} from '../../../discordjs/member';
import {BOT_COLOR} from '@epic-helper/constants';
import messageFormatter from '../../../discordjs/message-formatter';

export interface IGetUserGuildRoles {
  client: Client;
  server: Guild;
  userId: string;
}

const getUserGuildRoles = async ({server, userId, client}: IGetUserGuildRoles) => {
  const serverMember = await djsMemberHelper.getMember({
    serverId: server.id,
    client,
    userId,
  });
  if (!serverMember) return null;
  const guilds = await guildService.getAllGuildRoles({serverId: server.id});
  return serverMember.roles.cache.filter((userRole) =>
    guilds.some((guildRole) => userRole.id === guildRole.roleId)
  );
};

const renderMultipleGuildEmbed = (roles: Collection<string, Role>) =>
  new EmbedBuilder().setColor(BOT_COLOR.embed)
    .setDescription(`You can only have 1 role from the guild roles that have been setup in the server. 
    Please remove from the following roles
    
${roles.map((role) => messageFormatter.role(role.id)).join(' ')}
    `);

export const _guildHelper = {
  getUserGuildRoles,
  renderMultipleGuildEmbed,
};
