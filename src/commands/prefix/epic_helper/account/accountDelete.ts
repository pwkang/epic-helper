import {COMMAND_TYPE} from '../../../../constants/bot';
import {accountDelete} from '../../../../models/user/user.service';
import replyMessage from '../../../../lib/discord.js/replyMessage';

export default <PrefixCommand>{
  name: 'accountDelete',
  commands: ['delete'],
  type: COMMAND_TYPE.bot,
  execute: async (client, message) => {
    await accountDelete(message.author.id);
    replyMessage({
      client,
      message,
      options: `Successfully deleted your account!`,
    });
  },
};
