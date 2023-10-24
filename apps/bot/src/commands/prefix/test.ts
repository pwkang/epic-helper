import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message, args) => {
    await message.guild.members.fetch();
    const role = await message.guild.roles.fetch('766703369506914324', {
      force: false,
      cache: true,
    });
  },
};
