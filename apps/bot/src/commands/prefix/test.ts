import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {saveDuelLog} from '../../lib/epic-rpg/commands/progress/duel';
import {Message} from 'discord.js';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message, args) => {
    const msg = await message.channel.messages.fetch(args[1]);
    saveDuelLog({
      embed: msg.embeds[0],
      resultMessage: msg as Message<true>,
      user: message.author,
      targetUser: message.mentions.users.first(),
    });
  },
};
