import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';
import {SLASH_COMMAND} from '../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.account.donorPartner.name,
  description: SLASH_COMMAND.account.donorPartner.description,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister
  },
  commandName: SLASH_COMMAND.account.name,
  builder: (subcommand) => subcommand,
  execute: async (client, interaction) => {
    const setDonor = commandHelper.userAccount.setDonorP({
      author: interaction.user
    });
    let event = await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: setDonor.render(),
      interactive: true,
      onStop: () => {
        event = undefined;
      }
    });
    if (!event) return;
    event.every(async (interaction, customId) => {
      return await setDonor.responseInteraction(customId);
    });
  }
};
