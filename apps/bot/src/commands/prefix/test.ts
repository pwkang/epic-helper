import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {djsMessageHelper} from '../../lib/discordjs/message';
import {ActionRowBuilder, UserSelectMenuBuilder} from 'discord.js';
import {rpgGuildUpgrade} from '../../lib/epic-rpg/commands/guild/guild-upgrade';
import {rpgGuildRaid} from '../../lib/epic-rpg/commands/guild/guild-raid';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  execute: async (client, message) => {
    const collected = await message.channel.messages.fetch('1123853471830003712');
    rpgGuildRaid({
      author: message.author,
      message: collected,
      isSlashCommand: true,
      client,
    });
  },
};
