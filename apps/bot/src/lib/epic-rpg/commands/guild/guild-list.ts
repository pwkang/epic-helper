import type {Client, Embed, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {djsMessageHelper} from '../../../discordjs/message';
import {djsMemberHelper} from '../../../discordjs/member';
import {djsServerHelper} from '../../../discordjs/server';
import {guildService} from '../../../../services/database/guild.service';
import embedReaders from '../../embed-readers';
import commandHelper from '../../../epic-helper/command-helper';

interface IIdleGuild {
  client: Client;
  message: Message<true>;
  author: User;
  isSlashCommand?: boolean;
}

export const rpgGuildList = async ({
  author,
  client,
  isSlashCommand,
  message,
}: IIdleGuild) => {
  if (message.mentions.users.size) return;
  let event = createRpgCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isRpgGuildList({embed})) {
      event?.stop();
      const result = await commandHelper.guild.verifyGuild({
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
      await idleGuildListSuccess({
        embed,
        guildRoleId: userGuild.roleId,
        guildServerId: userGuild.serverId,
        author,
        client,
        serverId: message.guild.id,
      });
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IIdleGuildSuccess {
  embed: Embed;
  guildRoleId: string;
  guildServerId: string;
  author: User;
  client: Client;
  serverId: string;
}

const idleGuildListSuccess = async ({
  embed,
  guildRoleId,
  guildServerId,
  client,
  serverId,
}: IIdleGuildSuccess) => {
  if (serverId !== guildServerId) return;
  await djsMemberHelper.fetchAll({
    serverId,
    client,
  });
  const server = await djsServerHelper.getServer({
    serverId,
    client,
  });
  if (!server) return;
  const guildInfo = embedReaders.guildList({embed, guild: server});

  await guildService.registerUsersToGuild({
    serverId: guildServerId,
    roleId: guildRoleId,
    usersId: guildInfo.ids,
  });
  await djsMemberHelper.clearCached({
    client,
    serverId,
  });
};

interface IChecker {
  embed: Embed;
}

const isRpgGuildList = ({embed}: IChecker) =>
  embed.fields[0]?.name.match(/members$/);
