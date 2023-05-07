import {COMMAND_TYPE} from '../../../../constants/bot';
import {accountOn} from '../../../../models/user/user.service';
import replyMessage from '../../../../lib/discord.js/replyMessage';

export default <PrefixCommand>{
  name: 'accountOn',
  commands: ['on'],
  type: COMMAND_TYPE.bot,
  execute: async (client, message) => {
    await accountOn(message.author.id);
    replyMessage({
      client,
      message,
      options: `Successfully turned on the helper!`,
    });
  },
};
