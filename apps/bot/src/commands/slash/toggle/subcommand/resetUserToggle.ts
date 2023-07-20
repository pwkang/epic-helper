import type {IToggleSubcommand} from '../toggle.type';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {userService} from '../../../../services/database/user.service';

export const resetUserToggleSlash = async ({client, interaction}: IToggleSubcommand) => {
  const userAccount = await userService.resetUserToggle({
    userId: interaction.user.id,
  });
  if (!userAccount) return;

  const userToggle = await commandHelper.toggle.user({
    author: interaction.user,
  });
  if (!userToggle) return;

  const messageOptions = userToggle.render();
  await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: messageOptions,
  });
};
