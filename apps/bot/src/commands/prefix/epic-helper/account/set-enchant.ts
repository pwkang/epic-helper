import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';
import commandHelper from '../../../../lib/epic-helper/command-helper';

export default <PrefixCommand>{
  name: 'setEnchant',
  commands: ['set enchant', 'setEnchant', 'se'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn
  },
  execute: async (client, message) => {
    const setEnchant = await commandHelper.userAccount.setEnchant({
      author: message.author,
      server: message.guild!
    });
    let event = await djsMessageHelper.interactiveSend({
      client,
      channelId: message.channel.id,
      options: setEnchant.render(),
      onStop: () => {
        event = undefined;
      }
    });
    if (!event) return;
    event.every(async (interaction) => {
      if (!interaction.isStringSelectMenu()) return null;
      return await setEnchant.responseInteraction(interaction);
    });
  }
};
