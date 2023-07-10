import {IServerConfig} from '../type';
import commandHelper from '../../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../../lib/discordjs/interaction';

export const slashServerTTVerificationRemoveRule = async ({client, interaction}: IServerConfig) => {
  if (!interaction.inGuild() || !interaction.guild) return;
  const role = interaction.options.getRole('role', true);
  const ttVerification = await commandHelper.serverSettings.ttVerification({
    server: interaction.guild,
  });
  if (!ttVerification) return;
  const messageOptions = await ttVerification.removeRule({
    roleId: role.id,
  });
  await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: messageOptions,
  });
};
