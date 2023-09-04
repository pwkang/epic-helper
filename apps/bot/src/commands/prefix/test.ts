import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {
  _sendUpgraidResultToGuildChannel,
  verifyGuild,
} from '../../lib/epic-rpg/commands/guild/_shared';
import {rpgGuildRaidSuccess} from '../../lib/epic-rpg/commands/guild/guild-raid';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message) => {
    if (!message.inGuild()) return;
    const userGuild = await verifyGuild({
      author: message.author,
      client,
      server: message.guild,
      channelId: message.channel.id,
    });
    if (!userGuild) return;
    await rpgGuildRaidSuccess({
      author: message.author,
      guildRoleId: userGuild.roleId,
      guildServerId: userGuild.serverId,
      message,
    });

    const msg = await message.channel.messages.fetch('1148270129218592880');
    await _sendUpgraidResultToGuildChannel({
      guildRoleId: userGuild.roleId,
      client,
      guildServerId: userGuild.serverId,
      rpgEmbed: msg.embeds[0],
      actionChannelId: message.channel.id,
      author: message.author,
    });
  },
};
