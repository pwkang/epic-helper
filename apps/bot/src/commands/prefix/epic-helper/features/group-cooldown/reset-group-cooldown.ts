import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import commandHelper from '../../../../../lib/epic-helper/command-helper';
import {djsMessageHelper} from '../../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'reset-group-cooldown',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    donorOnly: true,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  commands: ['group cd reset', 'gcd reset', 'group cooldown reset'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const messageOptions = await commandHelper.groupCooldowns.resetGroupCooldowns({
      author: message.author,
    });
    if (!messageOptions) return;
    await djsMessageHelper.reply({
      client,
      message,
      options: messageOptions,
    });
  },
};
