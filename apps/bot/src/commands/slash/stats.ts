import {getStatsEmbeds, statsActionRow, TEventTypes} from '../../lib/epic-helper/features/stats';
import djsInteractionHelper from '../../lib/discordjs/interaction';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND} from './constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.stats.name,
  description: SLASH_COMMAND.stats.description,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  type: 'command',
  execute: async (client, interaction) => {
    const embeds = await getStatsEmbeds({
      author: interaction.user,
    });
    let event = await djsInteractionHelper.replyInteraction<TEventTypes>({
      client,
      interaction,
      options: {embeds: [embeds.donor], components: [statsActionRow]},
      interactive: true,
      onStop: () => {
        event = undefined;
      },
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
