import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import commandHelper from '../../lib/epic-helper/command-helper';
import {rpgGuildRaid, rpgGuildRaidSuccess} from '../../lib/epic-rpg/commands/guild/guild-raid';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  execute: async (client, message) => {
    // const role = await commandHelper.guild.getUserGuildRoles({
    //   client,
    //   userId: message.author.id,
    //   server: message.guild!,
    // });
    const role = await commandHelper.guild.getUserGuildRoles({
      client,
      userId: message.author.id,
      server: message.guild!,
    });
    rpgGuildRaidSuccess({
      author: message.author,
      message,
      embed: message.embeds[0],
      guildRoleId: role?.first()?.id!,
      server: message.guild!,
    });

    await commandHelper.guild.sendRecordsToGuildChannel({
      guildRoleId: role?.first()?.id!,
      client,
      serverId: message.guildId!,
    });
  },
};
