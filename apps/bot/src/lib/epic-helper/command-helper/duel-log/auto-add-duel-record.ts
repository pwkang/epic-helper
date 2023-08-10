import embedReaders from '../../../epic-rpg/embed-readers';
import {userDuelService} from '../../../../services/database/user-duel.service';
import {Client, Message, User} from 'discord.js';
import {guildDuelService} from '../../../../services/database/guild-duel.service';
import {redisGuildMembers} from '../../../../services/redis/guild-members.redis';

interface IAddDuelRecord {
  users: User[];
  duelMessage: Message<true>;
  client: Client;
}

export const autoAddDuelRecord = async ({users, duelMessage}: IAddDuelRecord) => {
  const duelResult = embedReaders.duelResult({
    embed: duelMessage.embeds[0],
    users,
  });
  userDuelService.addLog({
    duelAt: new Date(),
    source: {
      channelId: duelMessage.channel.id,
      serverId: duelMessage.guild.id,
      messageId: duelMessage.id,
    },
    users: duelResult.usersExp,
  });
  for (let user of duelResult.usersExp) {
    const guildInfo = await redisGuildMembers.getGuildInfo({
      userId: user.userId,
    });
    if (!guildInfo) continue;
    guildDuelService.addLog({
      userId: user.userId,
      serverId: guildInfo.serverId,
      expGained: user.guildExp,
      roleId: guildInfo.guildRoleId,
    });
  }
};
