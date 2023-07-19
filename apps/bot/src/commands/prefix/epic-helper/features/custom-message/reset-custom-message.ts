import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {userService} from '../../../../../services/database/user.service';
import {djsMessageHelper} from '../../../../../lib/discordjs/message';
import commandHelper from '../../../../../lib/epic-helper/command-helper';
import {CUSTOM_MESSAGE_PAGE_TYPE} from '../../../../../lib/epic-helper/command-helper/custom-message/custom-message.constant';
import toggleUserChecker from '../../../../../lib/epic-helper/donor-checker/toggle-checker/user';

export default <PrefixCommand>{
  name: 'customMessageReset',
  commands: ['customMessage reset', 'cm reset'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
  },
  execute: async (client, message) => {
    const userAccount = await userService.resetUserCustomMessage({
      userId: message.author.id,
    });
    const toggleChecker = await toggleUserChecker({userId: message.author.id});
    if (!userAccount || !toggleChecker) return;
    const event = await djsMessageHelper.interactiveSend({
      channelId: message.channel.id,
      client,
      options: await commandHelper.customMessage.getMessageOptions({
        client,
        userAccount,
        author: message.author,
        toggleChecker,
      }),
    });
    if (!event) return;
    for (const pageType of Object.values(CUSTOM_MESSAGE_PAGE_TYPE)) {
      event.on(pageType, async (interaction) => {
        if (!interaction.isButton()) return null;

        return await commandHelper.customMessage.getMessageOptions({
          client,
          userAccount,
          author: interaction.user,
          pageType,
          toggleChecker,
        });
      });
    }
  },
};
