import {Client, Embed, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {IMessageEmbedChecker} from '../../../../types/utils';
import embedReaders from '../../embed-readers';
import {guildService} from '../../../../services/database/guild.service';
import {toggleGuildChecker} from '../../../epic-helper/toggle-checker/guild';
import {verifyGuild} from './_shared';
import {djsMessageHelper} from '../../../discordjs/message';

export interface IRpgGuild {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export const rpgGuild = ({author, client, message, isSlashCommand}: IRpgGuild) => {
  if (!message.inGuild() || !!message.mentions.users.size) return;
  let event = createRpgCommandListener({
    channelId: message.channel.id,
    client,
    author,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isGuildSuccess({author, embed})) {
      event?.stop();
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
      await rpgGuildSuccess({
        author,
        embed,
        guildServerId: userGuild.serverId,
        guildRoleId: userGuild.roleId,
        isSlashCommand,
      });
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IRpgGuildSuccess {
  author: User;
  embed: Embed;
  guildServerId: string;
  guildRoleId: string;
  isSlashCommand?: boolean;
}

const rpgGuildSuccess = async ({
  embed,
  guildServerId,
  guildRoleId,
  isSlashCommand,
}: IRpgGuildSuccess) => {
  const guildInfo = embedReaders.guild({
    embed,
  });
  const guildToggle = await toggleGuildChecker({
    serverId: guildServerId,
    roleId: guildRoleId,
  });

  if (isSlashCommand) {
    // return if guild name is not matched in slash command
    const currentGuild = await guildService.findGuild({
      serverId: guildServerId,
      roleId: guildRoleId,
    });
    if (currentGuild && currentGuild.info.name !== guildInfo.name) return;
  }
  const guild = await guildService.findGuild({
    serverId: guildServerId,
    roleId: guildRoleId,
  });
  if (!guild) return;
  if (guildToggle?.upgraid.reminder) {
    await guildService.registerReminder({
      readyIn: guildInfo.readyIn,
      roleId: guildRoleId,
      serverId: guildServerId,
    });
    if (!guild) return;
  }
  await guildService.updateGuildInfo({
    serverId: guildServerId,
    roleId: guildRoleId,
    name: guildInfo.name === guild.info.name ? undefined : guildInfo.name,
    stealth: guildInfo.stealth === guild.info.stealth ? undefined : guildInfo.stealth,
    level: guildInfo.level === guild.info.level ? undefined : guildInfo.level,
    energy: guildInfo.energy === guild.info.energy ? undefined : guildInfo.energy,
  });
};

const isGuildSuccess = ({embed}: IMessageEmbedChecker) =>
  embed.footer?.text.includes('Your guild was raided');
