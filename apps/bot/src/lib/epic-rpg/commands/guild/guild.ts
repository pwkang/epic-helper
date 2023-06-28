import {Client, Embed, Guild, GuildMember, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {IMessageEmbedChecker} from '../../../../types/utils';
import embedReaders from '../../embed-readers';
import commandHelper from '../../../epic-helper/command-helper';
import {djsMemberHelper} from '../../../discordjs/member';
import {djsMessageHelper} from '../../../discordjs/message';
import register from '../../../../commands/prefix/epic-helper/account/register';
import {guildService} from '../../../../services/database/guild.service';
import ms from 'ms';

export interface IRpgGuild {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export const rpgGuild = ({author, client, message, isSlashCommand}: IRpgGuild) => {
  if (!message.inGuild() || !!message.mentions.users.size) return;
  const event = createRpgCommandListener({
    channelId: message.channel.id,
    client,
    author,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isGuildSuccess({author, embed})) {
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
      rpgGuildSuccess({
        author,
        embed,
        server: message.guild,
        guildRoleId: roles.first()?.id!,
        isSlashCommand,
      });
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IRpgGuildSuccess {
  author: User;
  embed: Embed;
  server: Guild;
  guildRoleId: string;
  isSlashCommand?: boolean;
}

const rpgGuildSuccess = async ({
  author,
  embed,
  server,
  guildRoleId,
  isSlashCommand,
}: IRpgGuildSuccess) => {
  const guildInfo = embedReaders.guild({
    embed,
  });
  if (isSlashCommand) {
    // return if guild name is not matched in slash command
    const currentGuild = await guildService.findGuild({
      serverId: server.id,
      roleId: guildRoleId,
    });
    if (currentGuild && currentGuild.info.name !== guildInfo.name) return;
  }
  const guild = await guildService.registerReminder({
    readyIn: guildInfo.readyIn,
    roleId: guildRoleId,
    serverId: server.id,
  });
  if (!guild) return;
  await guildService.updateGuildInfo({
    serverId: server.id,
    name: guildInfo.name === guild.info.name ? undefined : guildInfo.name,
    stealth: guildInfo.stealth === guild.info.stealth ? undefined : guildInfo.stealth,
    level: guildInfo.level === guild.info.level ? undefined : guildInfo.level,
    energy: guildInfo.energy === guild.info.energy ? undefined : guildInfo.energy,
  });
};

const isGuildSuccess = ({author, embed}: IMessageEmbedChecker) =>
  embed.footer?.text.includes('Your guild was raided');
