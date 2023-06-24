import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'customMessageReset',
  commands: ['customMessage reset', 'cm reset'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: (client, message) => {},
};
