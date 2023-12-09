import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import commandHelper from '../../../../lib/epic-helper/command-helper';

export default <PrefixCommand>{
  name: 'rpgDonorP',
  commands: ['donorP'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
  },
  execute: async (client, message) => {
    const setDonor = commandHelper.userAccount.setDonorP({
      author: message.author,
    });
    let event = await djsMessageHelper.interactiveSend({
      client,
      channelId: message.channel.id,
      options: setDonor.render(),
      onStop: () => {
        event = undefined;
      },
    });
    if (!event) return;
    event.every(async (interaction, customId) => {
      return await setDonor.responseInteraction(customId);
    });
  },
};
