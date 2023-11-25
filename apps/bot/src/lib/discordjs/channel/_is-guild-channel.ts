import type {AnyThreadChannel, Channel, TextChannel} from 'discord.js';

const _isGuildChannel = (channel: Channel): channel is (TextChannel | AnyThreadChannel) => {
  if (!('guild' in channel)) return false;

  return channel.isThread() || channel.isTextBased();
};

export default _isGuildChannel;
