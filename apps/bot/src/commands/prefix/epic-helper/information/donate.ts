import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'donate',
  type: PREFIX_COMMAND_TYPE.bot,
  commands: ['donate', 'patreon'],
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  execute: async (client, message) => {
    const donateInfo = commandHelper.information.donate();

    await djsMessageHelper.send({
      client,
      channelId: message.channel.id,
      options: donateInfo.render(),
    });
  },
};
