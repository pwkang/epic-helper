import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'help',
  commands: ['help', 'h'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    userAccOff: USER_ACC_OFF_ACTIONS.skip
  },
  execute: async (client, message, args) => {
    const messageOptions = await commandHelper.information.help({
      client,
      search: args.slice(1).join(' ')
    });
    if (!messageOptions) return;
    await djsMessageHelper.send({
      client,
      channelId: message.channel.id,
      options: messageOptions
    });
  }
};
