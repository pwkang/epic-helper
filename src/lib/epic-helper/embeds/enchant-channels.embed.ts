import {EmbedBuilder, Guild} from 'discord.js';
import {IServer} from '../../../models/server/server.type';
import {BOT_COLOR} from '../../../constants/epic-helper/general';

interface IGetEnchantChannelsEmbed {
  guild: Guild;
  serverProfile: IServer;
}

const getEnchantChannelsEmbed = ({guild, serverProfile}: IGetEnchantChannelsEmbed) => {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${guild.name}'s enchant channels`,
      iconURL: guild.iconURL() ?? undefined,
    })
    .setColor(BOT_COLOR.embed);

  return embed;
};

export default getEnchantChannelsEmbed;
