import embeds from '../../../embeds';
import {generateDuelLogEmbed} from '../embeds/duel-log';
import {sendDuelLog} from '../send-duel-log';
import type {Client, User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {toggleGuildChecker} from '../../../toggle-checker/guild';
import {BOT_COLOR} from '@epic-helper/constants';
import {guildDuelService, guildService, redisServerInfo, userDuelService} from '@epic-helper/services';

interface IRegisterUserDuel {
  author: User;
  expGained: number;
  source?: {
    serverId: string;
    channelId: string;
    messageId: string;
  };
  isWinner: boolean;
  client: Client;
  commandChannelId?: string;
}

export const registerUserDuelLog = async ({
  expGained,
  source,
  author,
  isWinner,
  client,
  commandChannelId,
}: IRegisterUserDuel) => {
  const guildInfo = await guildService.findUserGuild({
    userId: author.id,
  });
  if (!guildInfo) return embeds.notInGuild();
  const toggleGuild = await toggleGuildChecker({
    roleId: guildInfo.roleId,
    serverId: guildInfo.serverId,
  });
  if (toggleGuild?.duel.refRequired && !source?.messageId) {
    return refRequiredEmbed;
  }
  const latestLog = await userDuelService.findLatestLog({
    userId: author.id,
  });
  const result = await userDuelService.addLog({
    duelAt: new Date(),
    source,
    user: {
      userId: author.id,
      guildExp: expGained,
      isWinner,
      reportGuild: {
        serverId: guildInfo.serverId,
        guildRoleId: guildInfo.roleId,
      },
    },
  });

  const guildDuel = await guildDuelService.addLog({
    userId: author.id,
    serverId: guildInfo.serverId,
    expGained: result.expGained,
    roleId: guildInfo.roleId,
    isUpdate: result.isExists,
  });

  if (!guildDuel) return embeds.notInGuild();

  const userDuel = guildDuel.users.find((u) => u.userId === author.id);

  const serverName = source
    ? await redisServerInfo.getServerInfo({serverId: source?.serverId})
    : undefined;

  const embed = generateDuelLogEmbed({
    author,
    newTotalExp: userDuel?.totalExp ?? 0,
    lastDuel: latestLog?.duelAt,
    newTotalDuel: userDuel?.duelCount ?? 0,
    expGained: result.expGained,
    source,
    serverName: serverName?.name ?? 'Unknown',
    isExists: result.isExists,
  });

  await sendDuelLog({
    client,
    embed,
    roleId: guildInfo.roleId,
    serverId: guildInfo.serverId,
    ignoreChannel: commandChannelId,
  });

  return embed;
};

const refRequiredEmbed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setDescription('Duel message link is required');
