import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {registerUserAccount} from '../../../../models/user/user.service';
import {RPG_CLICKABLE_SLASH_COMMANDS} from '../../../../constants/epic_rpg/clickable_slash';
import replyMessage from '../../../../lib/discord.js/message/replyMessage';

export default <PrefixCommand>{
  name: 'register',
  commands: ['register'],
  type: PREFIX_COMMAND_TYPE.bot,
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
        options: `Successfully registered!\nUse ${RPG_CLICKABLE_SLASH_COMMANDS.inventory} to start tracking your ruby amount.`,
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
