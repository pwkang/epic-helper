import {PREFIX_COMMAND_TYPE} from '../../../../../constants/bot';
import serverService from '../../../../../models/server/server.service';
import embedsList from '../../../../../lib/epic-helper/embeds';
import {djsMessageHelper} from '../../../../../lib/discord.js/message';

export default <PrefixCommand>{
  name: 'enchantChannels',
  commands: ['enchant channels'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    if (!message.inGuild()) return;
    const serverProfile = await serverService.getServer({
      serverId: message.guildId,
    });
    if (!serverProfile) return;
    const embed = embedsList.enchantChannels({
      serverProfile,
      guild: message.guild,
    });
    await djsMessageHelper.send({
      client,
      options: {
        embeds: [embed],
      },
      channelId: message.channelId,
    });
  },
};
