import {userDuelService} from '../../../../../services/database/user-duel.service';
import {guildDuelService} from '../../../../../services/database/guild-duel.service';
import embeds from '../../../embeds';
import {redisServerInfo} from '../../../../../services/redis/server-info.redis';
import {generateDuelLogEmbed} from '../embeds/duel-log';
import {sendDuelLog} from '../send-duel-log';
import {Client, User} from 'discord.js';
import {redisGuildMembers} from '../../../../../services/redis/guild-members.redis';

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
}

export const registerUserDuelLog = async ({
  expGained,
  source,
  author,
  isWinner,
  client,
}: IRegisterUserDuel) => {
  const guildInfo = await redisGuildMembers.getGuildInfo({
    userId: author.id,
  });
  if (!guildInfo) return embeds.notInGuild();
  const latestLog = await userDuelService.findLatestLog({
    userId: author.id,
  });
  await userDuelService.addLog({
    duelAt: new Date(),
    source,
    users: [
      {
        userId: author.id,
        guildExp: expGained,
        isWinner,
      },
    ],
  });

  const guildDuel = await guildDuelService.addLog({
    userId: author.id,
    serverId: guildInfo.serverId,
    expGained: expGained,
    roleId: guildInfo.guildRoleId,
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
    expGained,
    source,
    serverName: serverName?.name ?? 'Unknown',
  });
  await sendDuelLog({
    client,
    embed,
    roleId: guildInfo.guildRoleId,
    serverId: guildInfo.serverId,
  });
  return embed;
};
