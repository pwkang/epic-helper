import {Client, PermissionsBitField, TextChannel} from 'discord.js';
import sendMessage from '../message/sendMessage';
import {unMuteUser} from './unMuteUser.lib';

const requiredPermissions = [PermissionsBitField.Flags.ManageRoles];

interface IMuteUser {
  userId: string;
  channelId: string;
  client: Client;
  unMuteIn?: number;
}

export const muteUser = async ({userId, client, channelId, unMuteIn}: IMuteUser) => {
  const channel = client.channels.cache.get(channelId);
  if (!channel) return;
  if (!(channel instanceof TextChannel)) return;

  if (!channel.permissionsFor(client.user?.id ?? '')?.has(requiredPermissions)) {
    await sendMessage({
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
      await unMuteUser({
        client,
        channelId,
        userId,
        removeUser: !channel.permissionOverwrites.cache.has(userId),
      });
    }, unMuteIn);
  }
};
