import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';
import commandHelper from '../../../../lib/epic-helper/command-helper';

export default <PrefixCommand>{
  name: 'settings',
  commands: ['settings', 's'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.skip
  },
  execute: async (client, message) => {
    const userSettings = await commandHelper.userAccount.settings({
      author: message.author
    });
    if (!userSettings) return;
    let event = await djsMessageHelper.interactiveSend({
      client,
      channelId: message.channel.id,
      options: userSettings.render({
        type: 'settings'
      }),
      onStop: () => {
        event = undefined;
      }
    });
    if (!event) return;
    event.every(async (interaction) => {
      if (!interaction.isStringSelectMenu()) return null;
      return userSettings.responseInteraction(interaction);
    });
  }
};
