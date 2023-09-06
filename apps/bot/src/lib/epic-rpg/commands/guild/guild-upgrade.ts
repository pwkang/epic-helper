import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {Client, Guild, Message, User} from 'discord.js';
import {IMessageContentChecker, IMessageEmbedChecker} from '../../../../types/utils';
import {guildService} from '../../../../services/database/guild.service';
import ms from 'ms';
import {upgraidService} from '../../../../services/database/upgraid.service';
import {_sendUpgraidResultToGuildChannel, verifyGuild} from './_shared';
import {RPG_COOLDOWN_EMBED_TYPE} from '@epic-helper/constants';
import {toggleGuildChecker} from '../../../epic-helper/toggle-checker/guild';
import {djsMessageHelper} from '../../../discordjs/message';

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
    commandType: RPG_COOLDOWN_EMBED_TYPE.guild,
  });
  if (!event) return;
  event.on('embed', async (embed, collected) => {
    if (isGuildUpgradeSuccess({author, embed})) {
      const result = await verifyGuild({
        client,
        server: message.guild,
        userId: author.id,
      });
      if (result.errorEmbed) {
        await djsMessageHelper.send({
          client,
          channelId: message.channel.id,
          options: {
            embeds: [result.errorEmbed],
          },
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
        await rpgGuildUpgradeSuccess({
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
    if (
      isUserDontHaveGuild({author, message: collected}) ||
      isGuildCantBeUpgraded({author, message: collected})
    ) {
      event.stop();
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IRpgGuildUpgradeSuccess {
  author: User;
  guildRoleId: string;
  guildServerId: string;
  message: Message;
}

const rpgGuildUpgradeSuccess = async ({
  guildRoleId,
  author,
  guildServerId,
  message,
}: IRpgGuildUpgradeSuccess): Promise<void> => {
  await guildService.registerReminder({
    readyIn: ms('2h'),
    roleId: guildRoleId,
    serverId: guildServerId,
  });
  await upgraidService.addRecord({
    guildRoleId,
    serverId: guildServerId,
    userId: author.id,
    commandType: 'upgrade',
    upgraidAt: new Date(),
    actionChannelId: message.channel.id,
    actionServerId: message.guildId!,
    actionMessageId: message.id,
  });
};

const isGuildUpgradeSuccess = ({embed}: IMessageEmbedChecker) =>
  ['Guild successfully upgraded', 'Guild upgrade failed!'].some((msg) =>
    embed.description?.includes(msg)
  );

const isUserDontHaveGuild = ({author, message}: IMessageContentChecker) =>
  ['you don\'t have a guild', 'not in a guild'].some((msg) => message.content.includes(msg)) &&
  message.mentions.users.has(author.id);

const isGuildCantBeUpgraded = ({author, message}: IMessageContentChecker) =>
  ['it cannot be upgraded anymore'].some((msg) => message.content.includes(msg)) &&
  message.mentions.users.has(author.id);
