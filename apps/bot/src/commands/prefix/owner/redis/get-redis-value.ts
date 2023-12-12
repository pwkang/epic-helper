import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'getRedis',
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  commands: ['redis get'],
  execute: async (client, message, args) => {
    const key = args[2];
    if (!key.length) return;

    const data = await commandHelper.redis.getValue(key);
    await djsMessageHelper.send({
      client,
      options: {
        content: data ? data.url : 'No data found',
      },
      channelId: message.channel.id,
    });
  },
};
