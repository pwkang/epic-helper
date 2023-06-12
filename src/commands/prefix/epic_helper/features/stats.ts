import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {
  getStatsEmbeds,
  statsActionRow,
  TEventTypes,
} from '../../../../lib/epic_helper/features/stats.lib';
import sendInteractiveMessage from '../../../../lib/discord.js/message/sendInteractiveMessage';
import {ButtonStyle} from 'discord.js';

export default <PrefixCommand>{
  name: 'stats',
  type: PREFIX_COMMAND_TYPE.bot,
  commands: ['stats', 'stat', 'st'],
  execute: async (client, message) => {
    const embeds = await getStatsEmbeds({
      author: message.author,
    });
    const event = await sendInteractiveMessage<TEventTypes>({
      client,
      channelId: message.channel.id,
      options: {embeds: [embeds.donor], components: [statsActionRow]},
    });
    if (!event) return;
    event.on('default', async () => {
      return {
        embeds: [embeds.donor],
      };
    });
    event.on('thisWeek', async () => {
      return {
        embeds: [embeds.thisWeek],
      };
    });
    event.on('lastWeek', async () => {
      return {
        embeds: [embeds.lastWeek],
      };
    });
  },
};
