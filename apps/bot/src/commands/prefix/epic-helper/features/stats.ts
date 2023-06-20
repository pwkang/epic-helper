import {
  getStatsEmbeds,
  statsActionRow,
  TEventTypes,
} from '../../../../lib/epic-helper/features/stats';
import {ButtonStyle} from 'discord.js';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'stats',
  type: PREFIX_COMMAND_TYPE.bot,
  commands: ['stats', 'stat', 'st'],
  execute: async (client, message) => {
    const embeds = await getStatsEmbeds({
      author: message.author,
    });
    const event = await djsMessageHelper.interactiveSend<TEventTypes>({
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
