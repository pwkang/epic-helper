import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {Client, Guild, Message, User} from 'discord.js';
import {IMessageContentChecker, IMessageEmbedChecker} from '../../../../types/utils';
import {guildService} from '../../../../services/database/guild.service';
import ms from 'ms';
import {upgraidService} from '../../../../services/database/upgraid.service';
import {_checkUserGuildRoles, _sendUpgraidResultToGuildChannel} from './_shared';

interface IRpgGuildRaid {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export const rpgGuildRaid = async ({author, message, isSlashCommand, client}: IRpgGuildRaid) => {
  if (!message.inGuild() || !!message.mentions.users.size) return;
  const event = createRpgCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isGuildRaidSuccess({author, embed})) {
      const roleId = await _checkUserGuildRoles({
        channelId: message.channel.id,
        server: message.guild,
        client,
        author,
      });
      if (!roleId) return;
      await rpgGuildRaidSuccess({
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
  if (isSlashCommand) event.triggerCollect(message);
};

interface IRpgGuildRaidSuccess {
  author: User;
  server: Guild;
  guildRoleId: string;
  message: Message;
}

export const rpgGuildRaidSuccess = async ({
  guildRoleId,
  server,
  author,
  message,
}: IRpgGuildRaidSuccess): Promise<void> => {
  await guildService.registerReminder({
    readyIn: ms('2h'),
    roleId: guildRoleId,
    serverId: server.id,
  });
  await upgraidService.addRecord({
    guildRoleId,
    commandType: 'raid',
    userId: author.id,
    actionMessageId: message.id,
    actionServerId: message.guildId!,
    actionChannelId: message.channel.id,
    serverId: server.id,
    upgraidAt: new Date(),
  });
};

const isGuildRaidSuccess = ({author, embed}: IMessageEmbedChecker) =>
  [author.username, 'RAIDED'].every((msg) => embed.description?.includes(msg));

const isUserDontHaveGuild = ({author, message}: IMessageContentChecker) =>
  ["you don't have a guild", 'not in a guild'].some((msg) => message.content.includes(msg)) &&
  message.mentions.users.has(author.id);
