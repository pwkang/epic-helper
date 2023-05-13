import {COMMAND_TYPE} from '../../constants/bot';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: COMMAND_TYPE.dev,
  execute: async (client, message) => {
    const args = message.content.split(' ');
    if (!args[2]) return;
    const msg = await message.channel.messages.fetch(args[2]);
  },
};
