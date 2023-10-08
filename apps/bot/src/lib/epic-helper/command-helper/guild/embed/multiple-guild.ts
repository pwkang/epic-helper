import type {Collection, Role} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {BOT_COLOR} from '@epic-helper/constants';
import messageFormatter from '../../../../discordjs/message-formatter';

export const _renderMultipleGuildEmbed = (roles: Collection<string, Role>) =>
  new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setDescription(
      'You can only have 1 role from the guild roles that have been setup in the server.\n' +
        'Please remove from the following roles\n\n' +
        roles.map((role) => messageFormatter.role(role.id)).join(' ')
    );
