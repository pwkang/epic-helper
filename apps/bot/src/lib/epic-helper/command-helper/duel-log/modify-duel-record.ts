import {BaseMessageOptions, Client, EmbedBuilder, Guild, User} from 'discord.js';
import commandHelper from '../index';
import {guildDuelService} from '../../../../services/database/guild-duel.service';
import {BOT_COLOR} from '@epic-helper/constants';
import messageFormatter from '../../../discordjs/message-formatter';
import {userChecker} from '../../user-checker';

interface IModifyDuelRecord {
  client: Client;
  server: Guild;
  user: User;
  count: number;
  exp: number;
  author: User;
}

export const modifyDuelRecord = async ({
  client,
  user,
  server,
  exp,
  count,
  author,
}: IModifyDuelRecord): Promise<BaseMessageOptions> => {
  const isServerAdmin = await userChecker.isServerAdmin({client, server, userId: author.id});
  if (!isServerAdmin) {
    return {
      content: 'You do not have permission to modify duel record.',
    };
  }
  const userRoles = await commandHelper.guild.getUserGuildRoles({
    client,
    userId: user.id,
    server,
  });
  if (!userRoles?.size) {
    return {
      embeds: [getNotInGuildEmbed(user)],
    };
  }
  if (userRoles.size > 1) {
    return {
      embeds: [commandHelper.guild.renderMultipleGuildEmbed(userRoles)],
    };
  }
  const isGuildLeader = await userChecker.isGuildLeader({
    serverId: server.id,
    guildRoleId: userRoles.first()!.id,
    userId: author.id,
  });
  if (!isGuildLeader) {
    return {
      content: 'Nice try... You are not the guild leader',
    };
  }

  await guildDuelService.modifyUserDuel({
    userId: user.id,
    roleId: userRoles.first()!.id,
    serverId: server.id,
    duelCount: count,
    expGained: exp,
  });

  return {
    content: 'Successfully modified duel record.',
  };
};

const getNotInGuildEmbed = (user: User) =>
  new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setDescription(`${messageFormatter.user(user.id)} is not in any guild.`);
