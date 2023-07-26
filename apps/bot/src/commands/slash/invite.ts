import commandHelper from '../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../lib/discordjs/interaction';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <SlashCommand>{
  name: 'invite',
  description: 'Invite EPIC Helper to another server or join the official server',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  type: 'command',
  execute: async (client, interaction) => {
    const botInfo = commandHelper.information.invite();
    await djsInteractionHelper.replyInteraction({
      client,
      options: {
        embeds: [botInfo],
      },
      interaction,
    });
  },
};
