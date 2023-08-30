import {EmbedBuilder, User} from 'discord.js';
import {redisGuildMembers} from '../../../../services/redis/guild-members.redis';
import embeds from '../../embeds';
import {userDuelService} from '../../../../services/database/user-duel.service';
import {BOT_COLOR} from '@epic-helper/constants';
import {guildDuelService} from '../../../../services/database/guild-duel.service';

interface IUndoDuelRecord {
  user: User;
}

export const _undoDuelRecord = async ({user}: IUndoDuelRecord) => {
  const guildInfo = await redisGuildMembers.getGuildInfo({
    userId: user.id,
  });
  if (!guildInfo) return embeds.notInGuild();
  const result = await userDuelService.undoDuelRecord({
    userId: user.id,
  });
  if (result === null) return noRecordEmbed;
  await guildDuelService.undoUserDuel({
    serverId: guildInfo.serverId,
    userId: user.id,
    expGained: result,
    roleId: guildInfo.guildRoleId,
  });
  return successEmbed;
};

const noRecordEmbed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setDescription('No duel record found.');

const successEmbed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setDescription('Successfully undo duel record');
