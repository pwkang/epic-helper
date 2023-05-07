import {COMMAND_TYPE} from '../../../../constants/bot';
import {registerUser} from '../../../../models/user/user.service';
import {CLICKABLE_SLASH_RPG} from '../../../../constants/clickable_slash';
import replyMessage from '../../../../lib/discord.js/replyMessage';

export default <PrefixCommand>{
  name: 'register',
  commands: ['register'],
  type: COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const created = await registerUser({
      userId: message.author.id,
      username: message.author.username,
    });
    if (created) {
      replyMessage({
        client,
        message,
        options: `Successfully registered!\nUse ${CLICKABLE_SLASH_RPG.inventory} to start tracking your ruby amount.`,
      });
    } else {
      replyMessage({
        client,
        message,
        options: `You have already registered!`,
      });
    }
  },
};
