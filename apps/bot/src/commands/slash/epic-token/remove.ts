import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND} from '../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.epicToken.remove.name,
  description: SLASH_COMMAND.epicToken.remove.description,
  commandName: SLASH_COMMAND.epicToken.name,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  type: 'subcommand',
  execute: async (client, interaction) => {
    const removeToken = await commandHelper.epicToken.removeEpicToken({
      userId: interaction.user.id,
    });
    let event = await djsInteractionHelper.replyInteraction({
      client,
      options: removeToken.render(),
      interaction,
      interactive: true,
      onStop: () => {
        event = undefined;
      },
    });
    if (!event) return;
    event.every(async (interaction) => {
      return await removeToken.responseInteraction(interaction);
    });
  },
};
