import {IAccountSubcommand} from './type';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';

export const slashAccountOff = async ({client, interaction}: IAccountSubcommand) => {
  const messageOptions = await commandHelper.userAccount.turnOffAccount({
    author: interaction.user,
  });
  await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: messageOptions,
  });
};
