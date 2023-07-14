import patreonApi from '../../../../lib/patreon/api/patreon';
import {createJsonBin} from '@epic-helper/utils';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {toPatrons} from '../../../../lib/patreon/api/patreon.transformer';

export default <PrefixCommand>{
  name: 'donor',
  commands: ['d'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message) => {},
};
