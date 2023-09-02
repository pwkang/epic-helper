import {EmbedBuilder, User} from 'discord.js';
import {userDuelService} from '../../../../services/database/user-duel.service';
import {BOT_COLOR} from '@epic-helper/constants';
import {guildDuelService} from '../../../../services/database/guild-duel.service';

interface IUndoDuelRecord {
  user: User;
}

export const _undoDuelRecord = async ({user}: IUndoDuelRecord) => {
  const result = await userDuelService.undoDuelRecord({
    userId: user.id,
  });
  if (result === null) return noRecordEmbed;
  if (result.reportGuild) {
    await guildDuelService.undoUserDuel({
      serverId: result.reportGuild.serverId,
      userId: user.id,
      expGained: result.expRemoved,
      roleId: result.reportGuild.guildRoleId,
    });
  }
  return successEmbed;
};

const noRecordEmbed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setDescription('No duel record found.');

const successEmbed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setDescription('Successfully undo duel record');
