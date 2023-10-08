import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {SLASH_COMMAND} from '../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.toggle.show.name,
  description: SLASH_COMMAND.toggle.show.description,
  commandName: SLASH_COMMAND.toggle.name,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  execute: async (client, interaction) => {
    const userToggle = await commandHelper.toggle.user({
      author: interaction.user,
    });
    if (!userToggle) return;
    const messageOptions = userToggle.render();
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
    });
  },
};
