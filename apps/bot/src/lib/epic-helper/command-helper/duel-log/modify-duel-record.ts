import {BaseMessageOptions, Client, EmbedBuilder, Guild, User} from 'discord.js';
import commandHelper from '../index';
import {guildDuelService} from '../../../../services/database/guild-duel.service';
import {BOT_COLOR} from '@epic-helper/constants';
import messageFormatter from '../../../discordjs/message-formatter';
import {userChecker} from '../../user-checker';
import {toggleGuildChecker} from '../../toggle-checker/guild';
import {sendDuelLog} from './send-duel-log';
import {IGuild} from '@epic-helper/models';
import {guildService} from '../../../../services/database/guild.service';

interface IModifyDuelRecord {
  client: Client;
  server: Guild;
  user: User;
  count: number;
  exp: number;
  author: User;
  commandChannelId: string;
}

export const modifyDuelRecord = async ({
  client,
  user,
  server,
  exp,
  count,
  author,
  commandChannelId,
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
  const guildRole = userRoles.first()!;
  const isGuildLeader = await userChecker.isGuildLeader({
    serverId: server.id,
    guildRoleId: guildRole.id,
    userId: author.id,
  });
  if (!isServerAdmin && !isGuildLeader) {
    return {
      content: 'Nice try... You are not the guild leader',
    };
  }

  const guild = await guildService.findGuild({
    roleId: guildRole.id,
    serverId: server.id,
  });

  if (!guild) {
    return {
      content: 'There is no guild with this role',
    };
  }

  const currentLog = await guildDuelService.findUserCurrentRecord({
    userId: user.id,
    roleId: guildRole.id,
    serverId: server.id,
  });
  const prev = {
    count: currentLog?.duelCount ?? 0,
    exp: currentLog?.totalExp ?? 0,
  };
  const modifiedEmbed = getModifyLogEmbed({
    author,
    target: user,
    curr: {count, exp},
    prev,
    guild,
  });

  const toggleGuild = await toggleGuildChecker({
    roleId: guildRole.id,
    serverId: server.id,
  });

  if (toggleGuild?.duel.log.duelModify) {
    sendDuelLog({
      client,
      roleId: guildRole.id,
      serverId: server.id,
      embed: modifiedEmbed,
      ignoreChannel: commandChannelId,
    });
  }

  await guildDuelService.modifyUserDuel({
    userId: user.id,
    roleId: guildRole.id,
    serverId: server.id,
    duelCount: count,
    expGained: exp,
  });

  return {
    embeds: [modifiedEmbed],
  };
};

const getNotInGuildEmbed = (user: User) =>
  new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setDescription(`${messageFormatter.user(user.id)} is not in any guild.`);

interface IModifyDuelLog {
  author: User;
  target: User;
  prev: {
    count: number;
    exp: number;
  };
  curr: {
    count: number;
    exp: number;
  };
  guild: IGuild;
}

const getModifyLogEmbed = ({target, curr, prev, author, guild}: IModifyDuelLog) => {
  return new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setAuthor({name: `${guild.info.name} — duel log`})
    .addFields(
      {
        name: 'User',
        value: messageFormatter.user(target.id),
      },
      {
        name: 'From',
        value: `\`\`${prev.exp} exp ${prev.count} duels\`\``,
        inline: true,
      },
      {
        name: 'To',
        value: `\`\`${curr.exp} exp ${curr.count} duels\`\``,
        inline: true,
      }
    )
    .setFooter({text: `Modified by ${author.username}`});
};
