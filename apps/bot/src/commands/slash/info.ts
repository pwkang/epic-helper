import commandHelper from '../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../lib/discordjs/interaction';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashCommand>{
  name: 'info',
  description: 'General information about the bot',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  type: 'command',
  execute: async (client, interaction) => {
    const botInfo = await commandHelper.information.info({
      client,
      server: interaction.guild!,
    });
    await djsInteractionHelper.replyInteraction({
      client,
      options: {
        embeds: [botInfo],
      },
      interaction,
    });
  },
};
