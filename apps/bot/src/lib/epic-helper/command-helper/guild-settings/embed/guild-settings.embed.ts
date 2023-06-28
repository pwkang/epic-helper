import {IGuild} from '@epic-helper/models';
import {EmbedBuilder} from 'discord.js';
import {BOT_COLOR} from '@epic-helper/constants';
import messageFormatter from '../../../../discordjs/message-formatter';
import timestampHelper from '../../../../discordjs/timestamp';

export interface IGetGuildReminderEmbed {
  guildAccount: IGuild;
}

export const _getGuildSettingsEmbed = ({guildAccount}: IGetGuildReminderEmbed): EmbedBuilder => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setTitle(`${guildAccount.info.name ?? ''} Settings`)
    .addFields(
      {
        name: 'Leader',
        value: guildAccount.leaderId ? messageFormatter.user(guildAccount.leaderId) : '-',
        inline: true,
      },
      {
        name: 'Guild Role',
        value: messageFormatter.role(guildAccount.roleId),
        inline: true,
      },
      {
        name: '🔔 REMINDER',
        value: [
          `**Channel:** ${
            guildAccount.upgraid.channelId
              ? messageFormatter.channel(guildAccount.upgraid.channelId)
              : '-'
          }`,
          `**Upgrade Message:** ${guildAccount.upgraid.message.upgrade ?? '-'}`,
          `**Raid Message:** ${guildAccount.upgraid.message.raid ?? '-'}`,
          `**Target Stealth:** ${guildAccount.upgraid.targetStealth ?? '-'}`,
          `**Status:** ${
            guildAccount.upgraid.readyAt
              ? timestampHelper.relative({time: guildAccount.upgraid.readyAt})
              : 'ready'
          }`,
        ].join('\n'),
        inline: false,
      }
    );

  return embed;
};
