import {SlashCommandBuilder} from 'discord.js';
import {
  getStatsEmbeds,
  statsActionRow,
  TEventTypes,
} from '../../lib/epic_helper/features/stats.lib';
import replyInteraction from '../../lib/discord.js/interaction/replyInteraction';

export default <SlashCommand>{
  name: 'user-stats',
  builder: new SlashCommandBuilder().setName('stats').setDescription('Commands counter'),
  execute: async (client, interaction) => {
    const embeds = await getStatsEmbeds({
      author: interaction.user,
    });
    const event = await replyInteraction<TEventTypes>({
      client,
      interaction,
      options: {embeds: [embeds.donor], components: [statsActionRow]},
      interactive: true,
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
