import {IServerConfig} from '../type';
import commandHelper from '../../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../../lib/discordjs/interaction';

export const slashServerTTVerificationSetRule = async ({client, interaction}: IServerConfig) => {
  if (!interaction.inGuild() || !interaction.guild) return;
  const role = interaction.options.getRole('role', true);
  const minTT = interaction.options.getNumber('min-tt', true);
  const maxTT = interaction.options.getNumber('max-tt') ?? undefined;
  const message = interaction.options.getString('message') ?? undefined;
  console.log({role, minTT, maxTT, message});
  const ttVerification = await commandHelper.serverSettings.ttVerification({
    server: interaction.guild,
  });
  if (!ttVerification) return;
  const messageOptions = await ttVerification.setRule({
    maxTT,
    minTT,
    roleId: role.id,
    message,
  });
  await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: messageOptions,
  });
};
