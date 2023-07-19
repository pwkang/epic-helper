import type {IToggleSubcommand} from '../toggle.type';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';

export const setUserToggleSlash = async ({client, interaction}: IToggleSubcommand) => {
  const onStr = interaction.options.getString('on');
  const offStr = interaction.options.getString('off');
  const userToggle = await commandHelper.toggle.user({
    author: interaction.user,
  });
  if (!userToggle) return;
  const messageOptions = await userToggle.update({
    on: onStr ?? undefined,
    off: offStr ?? undefined,
  });
  if (!messageOptions) return;
  await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: messageOptions,
  });
};
