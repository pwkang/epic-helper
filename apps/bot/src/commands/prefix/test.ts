import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {Message} from 'discord.js';
import commandHelper from '../../lib/epic-helper/command-helper';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message, args) => {
    const msg = await message.channel.messages.fetch(args[1]);
    commandHelper.duel.autoAdd({
      duelMessage: msg as Message<true>,
      users: [message.author, message.mentions.users.first()!],
      client,
    });
  },
};
