import {IAccountSubcommand} from './type';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';

export const slashAccountEnchantTier = async ({client, interaction}: IAccountSubcommand) => {
  const setEnchantTier = await commandHelper.userAccount.setEnchant({
    author: interaction.user,
    server: interaction.guild!,
  });
  const event = await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: setEnchantTier.render(),
    interactive: true,
  });
  if (!event) return;
  event.every(async (interaction) => {
    if (!interaction.isStringSelectMenu()) return null;
    return await setEnchantTier.responseInteraction(interaction);
  });
};
