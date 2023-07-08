import {IAccountSubcommand} from './type';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';

export const slashShowUserAccount = async ({client, interaction}: IAccountSubcommand) => {
  const userSettings = await commandHelper.userAccount.settings({
    author: interaction.user,
  });
  if (!userSettings) return;
  const event = await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: userSettings.render({
      type: 'settings',
    }),
    interactive: true,
  });
  if (!event) return;
  event.every(async (interaction) => {
    if (!interaction.isStringSelectMenu()) return null;
    return userSettings.responseInteraction(interaction);
  });
};
