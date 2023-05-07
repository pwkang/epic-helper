import {COMMAND_TYPE} from '../../../../constants/bot';
import {userAccountOff} from '../../../../models/user/user.service';
import replyMessage from '../../../../lib/discord.js/message/replyMessage';

export default <PrefixCommand>{
  name: 'accountOff',
  commands: ['off'],
  type: COMMAND_TYPE.bot,
  execute: async (client, message) => {
    await userAccountOff(message.author.id);
    replyMessage({
      client,
      message,
      options: `Successfully turned off the helper!`,
    });
  },
};
