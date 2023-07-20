import {IAccountSubcommand} from './type';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {userService} from '../../../../services/database/user.service';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {CUSTOM_MESSAGE_PAGE_TYPE} from '../../../../lib/epic-helper/command-helper/custom-message/custom-message.constant';
import toggleUserChecker from '../../../../lib/epic-helper/donor-checker/toggle-checker/user';

export const slashAccountCustomMessages = async ({client, interaction}: IAccountSubcommand) => {
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
};
