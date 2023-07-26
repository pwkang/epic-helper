import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND_EPIC_TOKEN_NAME} from './constant';

export default <SlashCommand>{
  name: 'remove',
  description: 'Remove all your epic token from a server',
  commandName: SLASH_COMMAND_EPIC_TOKEN_NAME,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  type: 'subcommand',
  execute: async (client, interaction) => {
    const removeToken = await commandHelper.epicToken.removeEpicToken({
      userId: interaction.user.id,
    });
    const event = await djsInteractionHelper.replyInteraction({
      client,
      options: removeToken.render(),
      interaction,
      interactive: true,
    });
    if (!event) return;
    event.every(async (interaction) => {
      return await removeToken.responseInteraction(interaction);
    });
  },
};
