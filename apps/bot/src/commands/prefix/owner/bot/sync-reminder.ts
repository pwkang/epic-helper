import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discordjs/message';

export default <PrefixCommand>{
  name: 'sync-reminder',
  type: PREFIX_COMMAND_TYPE.dev,
  commands: ['sync reminder'],
  preCheck: {},
  execute: async (client, message) => {
    const synced = await commandHelper.utils.syncReminderToDb();
    await djsMessageHelper.send({
      channelId: message.channel.id,
      client,
      options: {
        content: `Synced ${synced} reminders`,
      },
    });
  },
};
