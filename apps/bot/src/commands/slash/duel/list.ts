import {SLASH_COMMAND} from '../constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';

export default <SlashCommand>{
  name: SLASH_COMMAND.duel.list.name,
  description: SLASH_COMMAND.duel.list.description,
  commandName: SLASH_COMMAND.duel.name,
  type: 'subcommand',
  builder: (subcommand) => subcommand,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  execute: async (client, interaction) => {
    if (!interaction.guild) return;
    const duelLog = await commandHelper.duel.view({
      server: interaction.guild,
      author: interaction.user,
      client,
    });
    const event = await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      interactive: true,
      options: duelLog.render(),
    });
    if (!event) return;
    event.every((interaction) => {
      return duelLog.replyInteraction({
        interaction,
      });
    });
  },
};
