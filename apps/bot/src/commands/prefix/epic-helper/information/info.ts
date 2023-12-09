import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import commandHelper from '../../../../lib/epic-helper/command-helper';

export default <PrefixCommand>{
  name: 'info',
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  commands: ['info'],
  execute: async (client, message) => {
    if (!message.inGuild()) return;
    const botInfo = await commandHelper.information.info({
      client,
      server: message.guild,
    });
    await djsMessageHelper.send({
      client,
      options: {
        embeds: [botInfo],
      },
      channelId: message.channel.id,
    });
  },
};
