import {IEpicTokenSubcommand} from '../epic-token.type';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';

export const removeEpicToken = async ({interaction, client}: IEpicTokenSubcommand) => {
  const removeToken = await commandHelper.epicToken.removeEpicToken({
    userId: interaction.user.id,
  });
  const event = await djsInteractionHelper.replyInteraction({
    client,
    options: removeToken.render(),
    interaction,
    interactive: true,
  });
  if (!event) return;
  event.every(async (interaction) => {
    return await removeToken.responseInteraction(interaction);
  });
};
