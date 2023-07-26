import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND_ACCOUNT_NAME} from './constant';

export default <SlashCommand>{
  name: 'off',
  description: 'Turn off your account',
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  commandName: SLASH_COMMAND_ACCOUNT_NAME,
  builder: (subcommand) => subcommand,
  execute: async (client, interaction) => {
    const messageOptions = await commandHelper.userAccount.turnOffAccount({
      author: interaction.user,
    });
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
    });
  },
};
