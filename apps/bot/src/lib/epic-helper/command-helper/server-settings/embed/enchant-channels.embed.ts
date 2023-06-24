import {EmbedBuilder, EmbedField, Guild} from 'discord.js';
import {IServer} from '@epic-helper/models';
import {BOT_COLOR} from '@epic-helper/constants';
import convertMsToHumanReadableString from '../../../../../utils/convert-ms-to-human-readable-string';

export interface IGetEnchantChannelsEmbed {
  guild: Guild;
  enchantSettings: IServer['settings']['enchant'];
}

const getEnchantChannelsEmbed = ({guild, enchantSettings}: IGetEnchantChannelsEmbed) => {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${guild.name}'s enchant channels`,
      iconURL: guild.iconURL() ?? undefined,
    })
    .setColor(BOT_COLOR.embed)
    .setThumbnail(guild.iconURL());

  const fields: EmbedField[] = [
    {
      name: 'MUTE DURATION',
      value: convertMsToHumanReadableString(enchantSettings.muteDuration),
      inline: true,
    },
    {
      name: 'CHANNELS',
      value: enchantSettings.channels.length
        ? enchantSettings.channels
            .map((channel) => {
              return `<#${channel.channelId}>`;
            })
            .join(', ')
        : '-',
      inline: true,
    },
    {
      name: 'COMMANDS',
      value: settings.join('\n'),
      inline: false,
    },
  ];

  embed.addFields(fields);

  return embed;
};

export default getEnchantChannelsEmbed;

const settings: string[] = [
  `\`/config server enchant-channels\` - Configure enchant channels`,
  `\`/config server enchant-mute-duration\` - Configure enchant mute duration`,
];
