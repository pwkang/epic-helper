import {IServerConfig} from '../type';
import commandHelper from '../../../../../lib/epic-helper/command-helper';
import djsInteractionHelper from '../../../../../lib/discordjs/interaction';

export const slashServerTTVerificationSetChannels = async ({
  client,
  interaction,
}: IServerConfig) => {
  if (!interaction.inGuild() || !interaction.guild) return;
  const channel = interaction.options.getChannel('channel', true);
  const ttVerification = await commandHelper.serverSettings.ttVerification({
    server: interaction.guild,
  });
  if (!ttVerification) return;
  const messageOptions = await ttVerification.setChannel({
    channelId: channel.id,
  });
  await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: messageOptions,
  });
};
