import {Client, PermissionsBitField, TextChannel} from 'discord.js';
import djsChannelHelper from './index';
import {djsMessageHelper} from '../message';

const requiredPermissions = [PermissionsBitField.Flags.ManageRoles];

interface IMuteUser {
  userId: string;
  channelId: string;
  client: Client;
  unMuteIn?: number;
}

export const _muteUser = async ({userId, client, channelId, unMuteIn}: IMuteUser) => {
  const channel = client.channels.cache.get(channelId);
  if (!channel) return;
  if (!(channel instanceof TextChannel)) return;

  if (!channel.permissionsFor(client.user?.id ?? '')?.has(requiredPermissions)) {
    await djsMessageHelper.send({
      channelId,
      client,
      options: {
        content:
          'I do not have permission to mute this user. Please make sure I have the `Manage Roles` permission.',
      },
    });
    return;
  }

  await channel.permissionOverwrites.edit(userId, {
    SendMessages: false,
  });

  if (unMuteIn) {
    setTimeout(async () => {
      await djsChannelHelper.unMuteUser({
        client,
        channelId,
        userId,
        removeUser: !channel.permissionOverwrites.cache.has(userId),
      });
    }, unMuteIn);
  }
};
