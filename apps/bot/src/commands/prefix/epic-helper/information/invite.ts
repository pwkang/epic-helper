import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import commandHelper from '../../../../lib/epic-helper/command-helper';

export default <PrefixCommand>{
  name: 'invite',
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  commands: ['invite', 'inv'],
  execute: async (client, message) => {
    const botInfo = await commandHelper.information.invite();
    await djsMessageHelper.send({
      client,
      options: {
        embeds: [botInfo],
      },
      channelId: message.channel.id,
    });
  },
};
