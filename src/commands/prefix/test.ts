import {COMMAND_TYPE} from '../../constants/commands';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: COMMAND_TYPE.dev,
  execute: async (client, message) => {
    console.log('test');
  },
};
