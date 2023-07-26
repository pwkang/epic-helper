import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND_ACCOUNT_NAME} from './constant';

export default <SlashCommand>{
  name: 'delete',
  description: 'Delete your account',
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  commandName: SLASH_COMMAND_ACCOUNT_NAME,
  builder: (subcommand) => subcommand,
  execute: async (client, interaction) => {
    const deleteAccount = commandHelper.userAccount.deleteAccount({
      author: interaction.user,
    });
    const event = await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: deleteAccount.render(),
      interactive: true,
    });
    if (!event) return;
    event.every(async (interaction, customId) => {
      return await deleteAccount.responseInteraction(customId);
    });
  },
};
