import type {TEventTypes} from '../../lib/epic-helper/features/stats';
import djsInteractionHelper from '../../lib/discordjs/interaction';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND} from './constant';
import commandHelper from '../../lib/epic-helper/command-helper';

export default <SlashCommand>{
  name: SLASH_COMMAND.stats.name,
  description: SLASH_COMMAND.stats.description,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  type: 'command',
  execute: async (client, interaction) => {
    if (!interaction.guildId) return;
    const userStats = await commandHelper.userStats.showStats({
      author: interaction.user,
      serverId: interaction.guildId,
      client,
    });

    let event = await djsInteractionHelper.replyInteraction<TEventTypes>({
      client,
      interaction,
      options: userStats.render(),
      interactive: userStats.hasComponents,
      onStop: () => {
        event = undefined;
      },
    });
    if (!userStats.hasComponents) return;
    if (!event) return;
    event.every(userStats.replyInteraction);
  },
};
