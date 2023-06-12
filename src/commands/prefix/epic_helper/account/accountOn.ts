import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {userAccountOn} from '../../../../models/user/user.service';
import replyMessage from '../../../../lib/discord.js/message/replyMessage';

export default <PrefixCommand>{
  name: 'accountOn',
  commands: ['on'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    await userAccountOn(message.author.id);
    replyMessage({
      client,
      message,
      options: `Successfully turned on the helper!`,
    });
  },
};
