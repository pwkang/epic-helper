import {PREFIX_COMMAND_TYPE} from '../../../constants/bot';
import patreonApi from '../../../lib/patreon/api/patreon';
import createJsonBin from '../../../utils/json-bin';
import {djsMessageHelper} from '../../../lib/discord.js/message';

export default <PrefixCommand>{
  name: 'patron',
  commands: ['p'],
  type: PREFIX_COMMAND_TYPE.dev,
  execute: async (client, message) => {
    const data = await patreonApi.getPatrons();
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
