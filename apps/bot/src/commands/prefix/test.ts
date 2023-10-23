import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {getAllCommands} from '../../services/contentful/bot-help.contentful';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message, args) => {}
};
