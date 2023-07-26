import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {SLASH_COMMAND_ACCOUNT_NAME} from './constant';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashCommand>{
  name: 'settings',
  description: 'View your account settings',
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  commandName: SLASH_COMMAND_ACCOUNT_NAME,
  builder: (subcommand) => subcommand,
  execute: async (client, interaction) => {
    const userSettings = await commandHelper.userAccount.settings({
      author: interaction.user,
    });
    if (!userSettings) return;
    const event = await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: userSettings.render({
        type: 'settings',
      }),
      interactive: true,
    });
    if (!event) return;
    event.every(async (interaction) => {
      if (!interaction.isStringSelectMenu()) return null;
      return userSettings.responseInteraction(interaction);
    });
  },
};
