import {Collection, EmbedBuilder, Role} from 'discord.js';
import {BOT_COLOR} from '@epic-helper/constants';
import messageFormatter from '../../../discordjs/message-formatter';
import {_getUserGuildRoles} from './_get-user-guild-roles';

const renderMultipleGuildEmbed = (roles: Collection<string, Role>) =>
  new EmbedBuilder().setColor(BOT_COLOR.embed)
    .setDescription(`You can only have 1 role from the guild roles that have been setup in the server. 
    Please remove from the following roles
    
${roles.map((role) => messageFormatter.role(role.id)).join(' ')}
    `);

export const _guildHelper = {
  getUserGuildRoles: _getUserGuildRoles,
  renderMultipleGuildEmbed,
};
