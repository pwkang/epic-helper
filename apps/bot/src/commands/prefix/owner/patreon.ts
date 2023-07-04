import patreonApi from '../../../lib/patreon/api/patreon';
import {createJsonBin} from '@epic-helper/utils';
import {djsMessageHelper} from '../../../lib/discordjs/message';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'patron',
  commands: ['p'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message) => {
    const data = await patreonApi.getPatrons(client);
    if (!data) return;
    const response = await createJsonBin(data);
    djsMessageHelper.send({
      options: {
        content: response?.url,
      },
      channelId: message.channel.id,
      client,
    });
  },
};
