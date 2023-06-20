import {SlashCommandBuilder} from 'discord.js';
import {getStatsEmbeds, statsActionRow, TEventTypes} from '../../lib/epic-helper/features/stats';
import djsInteractionHelper from '../../lib/discordjs/interaction';

export default <SlashCommand>{
  name: 'user-stats',
  builder: new SlashCommandBuilder().setName('stats').setDescription('Commands counter'),
  execute: async (client, interaction) => {
    const embeds = await getStatsEmbeds({
      author: interaction.user,
    });
    const event = await djsInteractionHelper.replyInteraction<TEventTypes>({
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
