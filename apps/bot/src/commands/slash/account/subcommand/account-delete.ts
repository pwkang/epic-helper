import {IAccountSubcommand} from './type';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';

export const slashAccountDelete = async ({client, interaction}: IAccountSubcommand) => {
  const deleteAccount = commandHelper.userAccount.deleteAccount({
    author: interaction.user,
  });
  const event = await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: deleteAccount.render(),
    interactive: true,
  });
  if (!event) return;
  event.every(async (interaction, customId) => {
    return await deleteAccount.responseInteraction(customId);
  });
};
