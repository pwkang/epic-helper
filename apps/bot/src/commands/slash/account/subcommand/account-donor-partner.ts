import {IAccountSubcommand} from './type';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';

export const slashAccountDonorPartner = async ({client, interaction}: IAccountSubcommand) => {
  const setDonor = commandHelper.userAccount.setDonorP({
    author: interaction.user,
  });
  const event = await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: setDonor.render(),
    interactive: true,
  });
  if (!event) return;
  event.every(async (interaction, customId) => {
    return await setDonor.responseInteraction(customId);
  });
};
