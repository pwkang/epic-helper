import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'sync-user',
  type: PREFIX_COMMAND_TYPE.dev,
  commands: ['sync user'],
  preCheck: {},
  execute: async (client, message) => {
    const synced = await commandHelper.utils.syncUserToDb('10m');
    await djsMessageHelper.send({
      channelId: message.channel.id,
      client,
      options: {
        content: `Synced ${synced} users`,
      },
    });
  },
};
