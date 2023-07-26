import commandHelper from '../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND_ACCOUNT_NAME} from './constant';

export default <SlashCommand>{
  name: 'enchant-tier',
  description: 'Set the enchant tier for enchant mute helper',
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  commandName: SLASH_COMMAND_ACCOUNT_NAME,
  builder: (subcommand) => subcommand,
  execute: async (client, interaction) => {
    const setEnchantTier = await commandHelper.userAccount.setEnchant({
      author: interaction.user,
      server: interaction.guild!,
    });
    const event = await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: setEnchantTier.render(),
      interactive: true,
    });
    if (!event) return;
    event.every(async (interaction) => {
      if (!interaction.isStringSelectMenu()) return null;
      return await setEnchantTier.responseInteraction(interaction);
    });
  },
};
