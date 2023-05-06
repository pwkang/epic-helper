import {COMMAND_TYPE} from '../../constants/bot';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: COMMAND_TYPE.dev,
  execute: async (client, message) => {
    console.log('test');
  },
};
