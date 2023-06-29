import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {Client, Embed, Guild, Message, User} from 'discord.js';
import {IMessageContentChecker, IMessageEmbedChecker} from '../../../../types/utils';
import {guildService} from '../../../../services/database/guild.service';
import commandHelper from '../../../epic-helper/command-helper';
import ms from 'ms';
import {djsMessageHelper} from '../../../discordjs/message';
import {logger} from '@epic-helper/utils';
import {upgraidService} from '../../../../services/database/upgraid.service';

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
      const roles = await commandHelper.guild.getUserGuildRoles({
        client: author.client,
        userId: author.id,
        server: message.guild,
      });
      if (!roles || !roles.size) return;
      if (roles.size > 1) {
        return djsMessageHelper.send({
          channelId: message.channel.id,
          client,
          options: {
            embeds: [commandHelper.guild.renderMultipleGuildEmbed(roles)],
          },
        });
      }
      rpgGuildRaidSuccess({
        author,
        embed,
        server: message.guild,
        guildRoleId: roles.first()?.id!,
        message,
      });
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IRpgGuildRaidSuccess {
  author: User;
  embed: Embed;
  server: Guild;
  guildRoleId: string;
  message: Message;
}

const rpgGuildRaidSuccess = async ({
  guildRoleId,
  server,
  embed,
  author,
  message,
}: IRpgGuildRaidSuccess): Promise<void> => {
  logger('raid');
  await guildService.registerReminder({
    readyIn: ms('2h'),
    roleId: guildRoleId,
    serverId: server.id,
  });
  upgraidService.addRecord({
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
