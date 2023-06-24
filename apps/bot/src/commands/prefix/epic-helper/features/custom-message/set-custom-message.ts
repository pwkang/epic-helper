import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'customMessageSet',
  commands: ['customMessage set', 'cm set'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: (client, message, args) => {},
};
