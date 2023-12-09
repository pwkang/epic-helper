import {djsMessageHelper} from '../../../../../lib/discordjs/message';
import commandHelper from '../../../../../lib/epic-helper/command-helper';
import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'toggle',
  commands: ['toggle', 't'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
  },
  execute: async (client, message) => {
    const userToggle = await commandHelper.toggle.user({
      author: message.author,
      client,
      serverId: message.guild.id,
    });
    if (!userToggle) return;
    const messageOptions = userToggle.render();

    await djsMessageHelper.send({
      client,
      channelId: message.channel.id,
      options: messageOptions,
    });
  },
};
