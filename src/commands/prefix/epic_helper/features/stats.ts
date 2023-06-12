import {COMMAND_TYPE} from '../../../../constants/bot';
import {getStatsEmbeds} from '../../../../lib/epic_helper/features/stats.lib';
import sendInteractiveMessage from '../../../../lib/discord.js/message/sendInteractiveMessage';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js';

export default <PrefixCommand>{
  name: 'stats',
  type: COMMAND_TYPE.bot,
  commands: ['stats', 'stat', 'st'],
  execute: async (client, message) => {
    const embeds = await getStatsEmbeds({
      author: message.author,
    });
    const event = await sendInteractiveMessage({
      client,
      channelId: message.channel.id,
      options: {embeds: [embeds.donor], components: [row]},
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

const row = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    new ButtonBuilder().setCustomId('default').setLabel('Default').setStyle(ButtonStyle.Primary)
  )
  .addComponents(
    new ButtonBuilder().setCustomId('thisWeek').setLabel('This Week').setStyle(ButtonStyle.Primary)
  )
  .addComponents(
    new ButtonBuilder().setCustomId('lastWeek').setLabel('Last Week').setStyle(ButtonStyle.Primary)
  );
