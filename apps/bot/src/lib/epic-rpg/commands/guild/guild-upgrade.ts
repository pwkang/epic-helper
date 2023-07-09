import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {Client, Guild, Message, User} from 'discord.js';
import {IMessageContentChecker, IMessageEmbedChecker} from '../../../../types/utils';
import {guildService} from '../../../../services/database/guild.service';
import ms from 'ms';
import {upgraidService} from '../../../../services/database/upgraid.service';
import {_checkUserGuildRoles, _sendUpgraidResultToGuildChannel} from './_shared';

interface IRpgGuildUpgrade {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export const rpgGuildUpgrade = async ({
  author,
  message,
  isSlashCommand,
  client,
}: IRpgGuildUpgrade) => {
  if (!message.inGuild() || !!message.mentions.users.size) return;
  const event = createRpgCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isGuildUpgradeSuccess({author, embed})) {
      const roleId = await _checkUserGuildRoles({
        channelId: message.channel.id,
        server: message.guild,
        client,
        author,
      });
      if (!roleId) return;
      await rpgGuildUpgradeSuccess({
        author,
        server: message.guild,
        guildRoleId: roleId,
        message,
      });
      await _sendUpgraidResultToGuildChannel({
        guildRoleId: roleId,
        client,
        serverId: message.guildId!,
        rpgEmbed: embed,
        actionChannelId: message.channel.id,
      });
    }
  });
  event.on('content', async (content, collected) => {
    if (isUserDontHaveGuild({author, message}) || isGuildCantBeUpgraded({author, message})) {
      event.stop();
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IRpgGuildUpgradeSuccess {
  author: User;
  server: Guild;
  guildRoleId: string;
  message: Message;
}

const rpgGuildUpgradeSuccess = async ({
  guildRoleId,
  server,
  author,
  message,
}: IRpgGuildUpgradeSuccess): Promise<void> => {
  await guildService.registerReminder({
    readyIn: ms('2h'),
    roleId: guildRoleId,
    serverId: server.id,
  });
  await upgraidService.addRecord({
    guildRoleId,
    serverId: server.id,
    userId: author.id,
    commandType: 'upgrade',
    upgraidAt: new Date(),
    actionChannelId: message.channel.id,
    actionServerId: message.guildId!,
    actionMessageId: message.id,
  });
};

const isGuildUpgradeSuccess = ({author, embed}: IMessageEmbedChecker) =>
  ['Guild successfully upgraded', 'Guild upgrade failed!'].some((msg) =>
    embed.description?.includes(msg)
  );

const isUserDontHaveGuild = ({author, message}: IMessageContentChecker) =>
  ["you don't have a guild", 'not in a guild'].some((msg) => message.content.includes(msg)) &&
  message.mentions.users.has(author.id);

const isGuildCantBeUpgraded = ({author, message}: IMessageContentChecker) =>
  ['it cannot be upgraded anymore'].some((msg) => message.content.includes(msg)) &&
  message.mentions.users.has(author.id);