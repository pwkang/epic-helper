import {PREFIX_COMMAND_TYPE} from '../../../../../constants/bot';
import serverService from '../../../../../models/server/server.service';
import {djsMessageHelper} from '../../../../../lib/discord.js/message';

export default <PrefixCommand>{
  name: 'removeEnchantChannel',
  commands: ['enchant channels remove'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    if (!message.inGuild()) return;
    const enchantChannels = await serverService.getEnchantChannels({
      serverId: message.guildId,
    });

    if (!enchantChannels.some((channel) => channel.channelId === message.channel.id)) {
      return djsMessageHelper.reply({
        client,
        message,
        options: {
          content: `This channel is not added!`,
        },
      });
    }

    await serverService.removeEnchantChannels({
      serverId: message.guildId,
      channelIds: [message.channel.id],
    });

    await djsMessageHelper.send({
      client,
      options: {
        content: `Successfully removed this channel from an enchant channel`,
      },
      channelId: message.channel.id,
    });
  },
};
