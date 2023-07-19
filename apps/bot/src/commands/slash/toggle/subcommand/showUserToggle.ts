import type {IToggleSubcommand} from '../toggle.type';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';

export const showUserToggleSlash = async ({client, interaction}: IToggleSubcommand) => {
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
