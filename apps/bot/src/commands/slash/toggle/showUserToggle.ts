import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {SLASH_COMMAND_TOGGLE_NAME} from './constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashCommand>{
  name: 'show',
  description: 'Show personal toggle settings',
  type: 'subcommand',
  commandName: SLASH_COMMAND_TOGGLE_NAME,
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
