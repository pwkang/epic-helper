import {IEpicTokenSubcommand} from '../epic-token.type';
import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import commandHelper from '../../../../lib/epic-helper/command-helper';

export const useEpicToken = async ({interaction, client}: IEpicTokenSubcommand) => {
  if (!interaction.guildId) return;
  const token = interaction.options.getNumber('token', true);
  const messageOptions = await commandHelper.epicToken.useEpicToken({
    serverId: interaction.guildId,
    token,
    userId: interaction.user.id,
  });
  await djsInteractionHelper.replyInteraction({
    interaction,
    options: messageOptions,
    client,
  });
};
