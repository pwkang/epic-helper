import {BaseMessageOptions, Client, Guild, User} from 'discord.js';
import commandHelper from '../index';
import {guildDuelService} from '../../../../services/database/guild-duel.service';

interface IModifyDuelRecord {
  client: Client;
  server: Guild;
  user: User;
  count: number;
  exp: number;
}

export const modifyDuelRecord = async ({
  client,
  user,
  server,
  exp,
  count,
}: IModifyDuelRecord): Promise<BaseMessageOptions> => {
  const userRoles = await commandHelper.guild.getUserGuildRoles({
    client,
    userId: user.id,
    server,
  });
  if (!userRoles?.size) {
    return {
      content: `${user.username} is not in any guild.`,
    };
  }
  if (userRoles.size > 1) {
    return {
      embeds: [commandHelper.guild.renderMultipleGuildEmbed(userRoles)],
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
