import type {Client} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {serverChecker} from '../../server-checker';
import {serverService} from '../../../../services/database/server.service';
import commandHelper from '../index';
import {SERVER_SETTINGS_PAGE_TYPE} from './constant';
import {djsServerHelper} from '../../../discordjs/server';
import {BOT_COLOR, TOKENS_REQUIRED} from '@epic-helper/constants';

interface IEnchantMuteSettings {
  serverId: string;
  client: Client;
}

export const _enchantMuteSettings = async ({
  client,
  serverId,
}: IEnchantMuteSettings) => {
  const tokenStatus = await serverChecker.getTokenStatus({
    serverId,
    client,
  });
  const server = await djsServerHelper.getServer({
    serverId,
    client,
  });
  const enchantChannels = await serverService.getEnchantChannels({
    serverId,
  });

  const addChannels = async (channelsId: string[]) => {
    if (!server) return;
    const channels = server.channels.cache.filter(
      (channel) =>
        channelsId.includes(channel.id) &&
        (channel.isTextBased() || channel.isThread()) &&
        enchantChannels.every(
          (enchantChannel) => enchantChannel.channelId !== channel.id,
        ),
    );
    const totalChannels = channels.size + enchantChannels.length;
    if (
      tokenStatus.totalValidTokens < TOKENS_REQUIRED.enchantMute &&
      totalChannels > 3
    ) {
      const embed = new EmbedBuilder()
        .setColor(BOT_COLOR.embed)
        .setDescription(
          [
            'You can only have maximum 3 channels for enchant mute',
            'Checkout `donate` to view more information',
          ].join('\n'),
        );
      return {
        embeds: [embed],
      };
    }
    await serverService.addEnchantChannels({
      channels: channels.map((channel) => ({
        channelId: channel.id,
      })),
      serverId: server.id,
    });
    return render();
  };

  const removeChannels = async (channelsId: string[]) => {
    await serverService.removeEnchantChannels({
      serverId,
      channelIds: channelsId,
    });
    return render();
  };

  const reset = async () => {
    await serverService.resetEnchantChannels({
      serverId,
    });
    return render();
  };

  const render = async () => {
    if (!server) return;
    const serverSettings = await commandHelper.serverSettings.settings({
      server,
      client,
    });
    if (!serverSettings) return {};
    return serverSettings.render({
      type: SERVER_SETTINGS_PAGE_TYPE.enchantMute,
      displayOnly: true,
    });
  };

  return {
    addChannels,
    removeChannels,
    reset,
  };
};
