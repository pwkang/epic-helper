import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'clearRedis',
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  commands: ['redis delete', 'redis del'],
  execute: async (client, message, args) => {
    const values = args.slice(2);
    if (!values.length) return;

    const deleted = await commandHelper.redis.deleteValues(values);
    await djsMessageHelper.send({
      client,
      options: {
        content: `Deleted ${deleted} keys`,
      },
      channelId: message.channel.id,
    });

  },
};
