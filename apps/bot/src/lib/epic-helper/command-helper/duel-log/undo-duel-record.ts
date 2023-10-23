import type {Client, User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {userDuelService} from '../../../../services/database/user-duel.service';
import {BOT_COLOR} from '@epic-helper/constants';
import {guildDuelService} from '../../../../services/database/guild-duel.service';
import {sendDuelLog} from './send-duel-log';

interface IUndoDuelRecord {
  user: User;
  client: Client;
  commandChannelId?: string;
}

export const _undoDuelRecord = async ({
  user,
  client,
  commandChannelId,
}: IUndoDuelRecord) => {
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
    sendDuelLog({
      roleId: result.reportGuild.guildRoleId,
      serverId: result.reportGuild.serverId,
      embed: getUndoEmbed({author: user}),
      client,
      ignoreChannel: commandChannelId,
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

interface IGetUndoEmbed {
  author: User;
}

const getUndoEmbed = ({author}: IGetUndoEmbed) => {
  return new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setDescription(`${author.username} has undo a duel record`);
};
