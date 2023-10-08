import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';
import {SLASH_COMMAND} from '../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.account.delete.name,
  description: SLASH_COMMAND.account.delete.description,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister
  },
  commandName: SLASH_COMMAND.account.name,
  builder: (subcommand) => subcommand,
  execute: async (client, interaction) => {
    const deleteAccount = commandHelper.userAccount.deleteAccount({
      author: interaction.user
    });
    let event = await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: deleteAccount.render(),
      interactive: true,
      onStop: () => {
        event = undefined;
      }
    });
    if (!event) return;
    event.every(async (interaction, customId) => {
      return await deleteAccount.responseInteraction(customId);
    });
  }
};
