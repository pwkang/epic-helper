import {PREFIX_COMMAND_TYPE} from '../../../../../constants/bot';
import serverService from '../../../../../models/server/server.service';
import {djsMessageHelper} from '../../../../../lib/discord.js/message';

export default <PrefixCommand>{
  name: 'addEnchantChannel',
  commands: ['enchant channels add'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    if (!message.inGuild()) return;
    const enchantChannels = await serverService.getEnchantChannels({
      serverId: message.guildId,
    });

    if (enchantChannels.some((channel) => channel.channelId === message.channel.id)) {
      return djsMessageHelper.reply({
        client,
        message,
        options: {
          content: `This channel is already added`,
        },
      });
    }

    await serverService.addEnchantChannels({
      serverId: message.guildId,
      channels: [
        {
          channelId: message.channel.id,
        },
      ],
    });
    await djsMessageHelper.send({
      client,
      options: {
        content: `Successfully added this channel as an enchant channel`,
      },
      channelId: message.channel.id,
    });
  },
};
