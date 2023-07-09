import {IServerSettings} from '../type';
import {EmbedBuilder} from 'discord.js';
import {BOT_COLOR} from '@epic-helper/constants';
import messageFormatter from '../../../../discordjs/message-formatter';

export const _getTTVerificationSettingsEmbed = ({serverAccount, guild}: IServerSettings) => {
  const settings = serverAccount?.settings.ttVerification;
  return new EmbedBuilder()
    .setAuthor({
      name: `${guild.name}'s tt verification settings`,
      iconURL: guild.iconURL() ?? undefined,
    })
    .setColor(BOT_COLOR.embed)
    .addFields(
      {
        name: 'Channel',
        value: settings?.channelId ? messageFormatter.channel(settings.channelId) : '-',
        inline: true,
      },
      {
        name: 'Rules',
        value: settings?.rules.length
          ? settings.rules
              .map((rule) => {
                return `${messageFormatter.role(rule.roleId)}: ${rule.minTT} -> ${
                  rule.maxTT ?? '∞'
                }`;
              })
              .join('\n')
          : '-',
        inline: true,
      }
    );
};
