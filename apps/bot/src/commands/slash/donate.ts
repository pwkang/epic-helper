import commandHelper from '../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../lib/discordjs/interaction';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND} from './constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.donate.name,
  description: SLASH_COMMAND.donate.description,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  type: 'command',
  execute: async (client, interaction) => {
    const botInfo = await commandHelper.information.donate();
    await djsInteractionHelper.replyInteraction({
      client,
      options: botInfo.render(),
      interaction,
    });
  },
};
