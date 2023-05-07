import {COMMAND_TYPE} from '../../../../constants/bot';
import {accountOff} from '../../../../models/user/user.service';
import replyMessage from '../../../../lib/discord.js/replyMessage';

export default <PrefixCommand>{
  name: 'accountOff',
  commands: ['off'],
  type: COMMAND_TYPE.bot,
  execute: async (client, message) => {
    await accountOff(message.author.id);
    replyMessage({
      client,
      message,
      options: `Successfully turned off the helper!`,
    });
  },
};
