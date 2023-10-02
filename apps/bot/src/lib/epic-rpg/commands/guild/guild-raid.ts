import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {Client, Message, User} from 'discord.js';
import {IMessageContentChecker, IMessageEmbedChecker} from '../../../../types/utils';
import {guildService} from '../../../../services/database/guild.service';
import ms from 'ms';
import {upgraidService} from '../../../../services/database/upgraid.service';
import {_sendUpgraidResultToGuildChannel, verifyGuild} from './_shared';
import {RPG_COOLDOWN_EMBED_TYPE} from '@epic-helper/constants';
import {toggleGuildChecker} from '../../../epic-helper/toggle-checker/guild';
import {djsMessageHelper} from '../../../discordjs/message';

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
    commandType: RPG_COOLDOWN_EMBED_TYPE.guild,
  });
  if (!event) return;
  event.on('embed', async (embed, collected) => {
    if (isGuildRaidSuccess({author, embed})) {
      event.stop();
      const result = await verifyGuild({
        client,
        server: message.guild,
        userId: author.id,
      });
      if (result.errorEmbed) {
        await djsMessageHelper.send({
          channelId: message.channel.id,
          options: {
            embeds: [result.errorEmbed],
          },
          client,
        });
        return;
      }
      const userGuild = result.guild;
      if (!userGuild) return;
      const guildToggle = await toggleGuildChecker({
        serverId: userGuild.serverId,
        roleId: userGuild.roleId,
      });
      if (guildToggle?.upgraid.reminder) {
        await rpgGuildRaidSuccess({
          author,
          guildRoleId: userGuild.roleId,
          guildServerId: userGuild.serverId,
          message: collected,
        });
      }
      if (guildToggle?.upgraid.autoSendList) {
        await _sendUpgraidResultToGuildChannel({
          guildRoleId: userGuild.roleId,
          client,
          guildServerId: userGuild.serverId,
          rpgEmbed: embed,
          actionChannelId: message.channel.id,
          author,
        });
      }
    }
  });
  event.on('content', async (_, collected) => {
    if (!isUserDontHaveGuild({author, message: collected})) {
      event.stop();
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IRpgGuildRaidSuccess {
  author: User;
  guildRoleId: string;
  guildServerId: string;
  message: Message;
}

export const rpgGuildRaidSuccess = async ({
  guildRoleId,
  guildServerId,
  author,
  message,
}: IRpgGuildRaidSuccess): Promise<void> => {
  await guildService.registerReminder({
    readyIn: ms('2h'),
    roleId: guildRoleId,
    serverId: guildServerId,
  });
  await upgraidService.addRecord({
    guildRoleId,
    commandType: 'raid',
    userId: author.id,
    actionMessageId: message.id,
    actionServerId: message.guildId!,
    actionChannelId: message.channel.id,
    serverId: guildServerId,
    upgraidAt: new Date(),
  });
};

const isGuildRaidSuccess = ({author, embed}: IMessageEmbedChecker) =>
  [author.username, 'RAIDED'].every((msg) => embed.description?.includes(msg));

const isUserDontHaveGuild = ({author, message}: IMessageContentChecker) =>
  ['you don\'t have a guild', 'not in a guild'].some((msg) => message.content.includes(msg)) &&
  message.mentions.users.has(author.id);
