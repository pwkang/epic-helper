import djsInteractionHelper from '../../../lib/discordjs/interaction';
import {userService} from '../../../services/database/user.service';
import commandHelper from '../../../lib/epic-helper/command-helper';
import {CUSTOM_MESSAGE_PAGE_TYPE} from '../../../lib/epic-helper/command-helper/custom-message/custom-message.constant';
import toggleUserChecker from '../../../lib/epic-helper/toggle-checker/user';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {SLASH_COMMAND} from '../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.account.customMessage.name,
  description: SLASH_COMMAND.account.customMessage.description,
  type: 'subcommand',
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  commandName: SLASH_COMMAND.account.name,
  builder: (subcommand) => subcommand,
  execute: async (client, interaction) => {
    const userAccount = await userService.getUserAccount(interaction.user.id);
    const toggleChecker = await toggleUserChecker({userId: interaction.user.id});
    if (!userAccount || !toggleChecker) return;
    const event = await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      interactive: true,
      options: await commandHelper.customMessage.getMessageOptions({
        author: interaction.user,
        client,
        userAccount,
        toggleChecker,
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
          toggleChecker,
        });
      });
    }
  },
};
