import {PREFIX_COMMAND_TYPE, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {userService} from '../../../../../services/database/user.service';
import {djsMessageHelper} from '../../../../../lib/discordjs/message';
import commandHelper from '../../../../../lib/epic-helper/command-helper';
import {CUSTOM_MESSAGE_PAGE_TYPE} from '../../../../../lib/epic-helper/command-helper/custom-message/custom-message.constant';

export default <PrefixCommand>{
  name: 'customMessage',
  commands: ['customMessage', 'cm'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  execute: async (client, message) => {
    const userAccount = await userService.getUserAccount(message.author.id);
    if (!userAccount) return;
    const event = await djsMessageHelper.interactiveSend({
      channelId: message.channel.id,
      client,
      options: await commandHelper.customMessage.getMessageOptions({
        author: message.author,
        client,
        userAccount,
      }),
    });
    if (!event) return;
    for (const pageType of Object.values(CUSTOM_MESSAGE_PAGE_TYPE)) {
      event.on(pageType, async (interaction) => {
        if (!interaction.isButton()) return null;
        const customId = interaction.customId;

        return await commandHelper.customMessage.getMessageOptions({
          author: interaction.user,
          pageType: customId as ValuesOf<typeof CUSTOM_MESSAGE_PAGE_TYPE>,
          userAccount,
          client,
        });
      });
    }
  },
};
