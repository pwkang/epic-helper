import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import commandHelper from '../../lib/epic-helper/command-helper';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  execute: async (client, message) => {
    const role = await commandHelper.guild.getUserGuildRoles({
      client,
      userId: message.author.id,
      server: message.guild!,
    });
  },
};
