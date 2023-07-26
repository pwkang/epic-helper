import djsInteractionHelper from '../../../lib/discordjs/interaction';
import commandHelper from '../../../lib/epic-helper/command-helper';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND_ACCOUNT_NAME} from './constant';

export default <SlashCommand>{
  name: 'register',
  description: 'Register your account',
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  commandName: SLASH_COMMAND_ACCOUNT_NAME,
  builder: (subcommand) => subcommand,
  execute: async (client, interaction) => {
    const messageOptions = await commandHelper.userAccount.register({
      author: interaction.user,
      channelId: interaction.channelId,
    });
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
    });
  },
};
