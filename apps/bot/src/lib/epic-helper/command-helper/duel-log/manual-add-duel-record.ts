import {userDuelService} from '../../../../services/database/user-duel.service';
import {Client, EmbedBuilder, User} from 'discord.js';
import {guildDuelService} from '../../../../services/database/guild-duel.service';
import {redisGuildMembers} from '../../../../services/redis/guild-members.redis';
import {BOT_COLOR} from '@epic-helper/constants';
import messageFormatter from '../../../discordjs/message-formatter';
import embeds from '../../embeds';
import convertMsToHumanReadableString from '../../../../utils/convert-ms-to-human-readable-string';
import {redisServerInfo} from '../../../../services/redis/server-info.redis';
import {sendDuelLog} from './send-duel-log';

interface IManualAddDuelRecord {
  user: User;
  client: Client;
  expGained: number;
  hasWon: boolean;
  source?: {
    serverId: string;
    channelId: string;
    messageId: string;
  };
}

export const manualAddDuelRecord = async ({
  user,
  source,
  expGained,
  client,
  hasWon,
}: IManualAddDuelRecord): Promise<EmbedBuilder> => {
  const guildInfo = await redisGuildMembers.getGuildInfo({
    userId: user.id,
  });
  if (!guildInfo) return embeds.notInGuild();
  const latestLog = await userDuelService.findLatestLog({
    userId: user.id,
  });
  await userDuelService.addLog({
    duelAt: new Date(),
    source,
    users: [
      {
        userId: user.id,
        guildExp: expGained,
        isWinner: hasWon,
      },
    ],
  });

  const guildDuel = await guildDuelService.addLog({
    userId: user.id,
    serverId: guildInfo.serverId,
    expGained: expGained,
    roleId: guildInfo.guildRoleId,
  });

  if (!guildDuel) return embeds.notInGuild();

  const userDuel = guildDuel.users.find((u) => u.userId === user.id);

  const serverName = source
    ? await redisServerInfo.getServerInfo({serverId: source?.serverId})
    : undefined;

  const embed = generateEmbed({
    author: user,
    newTotalExp: userDuel?.totalExp ?? 0,
    lastDuel: latestLog?.duelAt,
    newTotalDuel: userDuel?.duelCount ?? 0,
    expGained,
    source,
    serverName: serverName?.name ?? 'Unknown',
  });
  sendDuelLog({
    client,
    embed,
    roleId: guildInfo.guildRoleId,
    serverId: guildInfo.serverId,
  });
  return embed;
};

interface IGenerateEmbed {
  author: User;
  lastDuel?: Date;
  expGained: number;
  newTotalExp: number;
  newTotalDuel: number;
  source?: {
    serverId: string;
    channelId: string;
    messageId: string;
  };
  serverName: string;
}

const generateEmbed = ({
  author,
  lastDuel,
  expGained,
  newTotalExp,
  newTotalDuel,
  source,
  serverName,
}: IGenerateEmbed) => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setAuthor({
      name: author.username,
      iconURL: author.displayAvatarURL(),
    })
    .setTitle(`Added ${expGained} XP`);
  const description = [`**New:** \`${newTotalExp} XP | ${newTotalDuel} duels\``];
  if (source) {
    description.push(
      `[Jump to duel result](${messageFormatter.messageUrl({
        channelId: source.channelId,
        messageId: source.messageId,
        serverId: source.serverId,
      })}) @ **${serverName}**`
    );
  }
  embed.setDescription(description.join('\n'));

  const timeStr = lastDuel
    ? convertMsToHumanReadableString(new Date().getTime() - lastDuel.getTime()) + ' ago'
    : 'N/A';
  embed.setFooter({
    text: `Last duel: ${timeStr}`,
  });
  return embed;
};
