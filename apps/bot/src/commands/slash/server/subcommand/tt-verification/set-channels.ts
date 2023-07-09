import {IServerConfig} from '../type';

export const slashServerTTVerificationSetChannels = async ({
  client,
  interaction,
}: IServerConfig) => {
  const channel = interaction.options.getChannel('channel', true);
};
