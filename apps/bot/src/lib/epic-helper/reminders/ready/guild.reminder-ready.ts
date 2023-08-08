import {Client} from 'discord.js';
import {djsMessageHelper} from '../../../discordjs/message';
import {guildService} from '../../../../services/database/guild.service';
import {toggleGuildChecker} from '../../toggle-checker/guild';

interface IGuildReminderTimesUp {
  client: Client;
  serverId: string;
  guildRoleId: string;
}

export const guildReminderTimesUp = async ({
  guildRoleId,
  client,
  serverId,
}: IGuildReminderTimesUp) => {
  const guild = await guildService.findGuild({
    serverId,
    roleId: guildRoleId,
  });
  if (!guild) return;
  const guildToggle = await toggleGuildChecker({
    roleId: guildRoleId,
    serverId,
  });
  if (!guildToggle?.upgraid.reminder) return;

  const messageToSend =
    guild.info.stealth >= guild.upgraid.targetStealth
      ? guild.upgraid.message.raid
      : guild.upgraid.message.upgrade;

  await djsMessageHelper.send({
    client,
    channelId: guild.upgraid.channelId,
    options: {
      content: messageToSend,
    },
  });
};
