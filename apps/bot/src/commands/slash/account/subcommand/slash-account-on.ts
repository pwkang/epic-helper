import {IAccountSubcommand} from './type';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';

export const slashAccountOn = async ({client, interaction}: IAccountSubcommand) => {
  const messageOptions = await commandHelper.userAccount.turnOnAccount({
    author: interaction.user,
  });
  await djsInteractionHelper.replyInteraction({
    options: messageOptions,
    interaction,
    client,
  });
};
