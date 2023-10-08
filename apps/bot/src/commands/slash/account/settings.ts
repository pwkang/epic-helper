import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND} from '../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.account.settings.name,
  description: SLASH_COMMAND.account.settings.description,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  commandName: SLASH_COMMAND.account.name,
  builder: (subcommand) => subcommand,
  execute: async (client, interaction) => {
    const userSettings = await commandHelper.userAccount.settings({
      author: interaction.user,
    });
    if (!userSettings) return;
    let event = await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: userSettings.render({
        type: 'settings',
      }),
      interactive: true,
      onStop: () => {
        event = undefined;
      },
    });
    if (!event) return;
    event.every(async (interaction) => {
      if (!interaction.isStringSelectMenu()) return null;
      return userSettings.responseInteraction(interaction);
    });
  },
};
