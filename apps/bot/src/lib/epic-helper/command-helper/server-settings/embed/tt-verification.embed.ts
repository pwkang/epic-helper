import type {IServerSettings} from '../type';
import {EmbedBuilder} from 'discord.js';
import {BOT_COLOR} from '@epic-helper/constants';
import messageFormatter from '../../../../discordjs/message-formatter';

export const _getTTVerificationSettingsEmbed = ({
  serverAccount,
  guild
}: IServerSettings) => {
  const settings = serverAccount?.settings.ttVerification;
  return new EmbedBuilder()
    .setAuthor({
      name: `${guild.name}'s tt verification settings`,
      iconURL: guild.iconURL() ?? undefined
    })
    .setColor(BOT_COLOR.embed)
    .addFields(
      {
        name: 'CHANNEL',
        value: settings?.channelId
          ? messageFormatter.channel(settings.channelId)
          : '-',
        inline: false
      },
      {
        name: 'RULES',
        value: settings?.rules.length
          ? settings.rules
            .sort((a, b) => a.minTT - b.minTT)
            .map((rule) => {
              return (
                `**Role:** ${messageFormatter.role(rule.roleId)}\n` +
                  `**Range:** ${rule.minTT} -> ${rule.maxTT ?? '∞'}\n` +
                  `**Message:** ${rule.message ?? '-'}\n`
              );
            })
            .join('\n')
          : '-',
        inline: false
      }
    );
};
