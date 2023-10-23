import type {BaseMessageOptions, Client, Guild, User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {guildDuelService} from '../../../../services/database/guild-duel.service';
import {BOT_COLOR} from '@epic-helper/constants';
import messageFormatter from '../../../discordjs/message-formatter';
import {userChecker} from '../../user-checker';
import {toggleGuildChecker} from '../../toggle-checker/guild';
import {sendDuelLog} from './send-duel-log';
import type {IGuild} from '@epic-helper/models';
import {guildService} from '../../../../services/database/guild.service';
import {verifyGuild} from '../../../epic-rpg/commands/guild/_shared';

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
  const result = await verifyGuild({
    client,
    userId: user.id,
    server,
  });
  if (result.errorEmbed) {
    return {
      embeds: [result.errorEmbed],
    };
  }
  const userGuild = result.guild;
  if (!userGuild) {
    return {
      embeds: [getNotInGuildEmbed(user)],
    };
  }
  const isServerAdmin = await userChecker.isServerAdmin({
    client,
    serverId: userGuild.serverId,
    userId: author.id,
  });
  const isGuildLeader = await userChecker.isGuildLeader({
    serverId: userGuild.serverId,
    guildRoleId: userGuild.roleId,
    userId: author.id,
  });
  if (!isServerAdmin && !isGuildLeader) {
    return {
      content: 'Nice try... You are not the guild leader or server admin',
    };
  }

  const guild = await guildService.findGuild({
    roleId: userGuild.roleId,
    serverId: userGuild.serverId,
  });

  if (!guild) {
    return {
      content: 'There is no guild with this role',
    };
  }

  const currentLog = await guildDuelService.findUserCurrentRecord({
    userId: user.id,
    roleId: userGuild.roleId,
    serverId: userGuild.serverId,
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
    roleId: userGuild.roleId,
    serverId: userGuild.serverId,
  });

  if (toggleGuild?.duel.log.duelModify) {
    sendDuelLog({
      client,
      roleId: userGuild.roleId,
      serverId: userGuild.serverId,
      embed: modifiedEmbed,
      ignoreChannel: commandChannelId,
    });
  }

  await guildDuelService.modifyUserDuel({
    userId: user.id,
    roleId: userGuild.roleId,
    serverId: userGuild.serverId,
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

const getModifyLogEmbed = ({
  target,
  curr,
  prev,
  author,
  guild,
}: IModifyDuelLog) => {
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
      },
    )
    .setFooter({text: `Modified by ${author.username}`});
};
