import {COMMAND_TYPE} from '../../../../constants/bot';
import {registerUserAccount} from '../../../../models/user/user.service';
import {CLICKABLE_SLASH_RPG} from '../../../../constants/clickable_slash';
import replyMessage from '../../../../lib/discord.js/message/replyMessage';

export default <PrefixCommand>{
  name: 'register',
  commands: ['register'],
  type: COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const created = await registerUserAccount({
      userId: message.author.id,
      username: message.author.username,
      channelId: message.channel.id,
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
