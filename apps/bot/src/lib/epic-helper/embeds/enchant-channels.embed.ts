import {EmbedBuilder, EmbedField, Guild} from 'discord.js';
import {IServer} from '../../../models/server/server.type';
import {BOT_COLOR} from '../../../constants/epic-helper/general';
import convertMsToHumanReadableString from '../../../utils/convert-ms-to-human-readable-string';
import {PREFIX} from '../../../constants/bot';

interface IGetEnchantChannelsEmbed {
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
