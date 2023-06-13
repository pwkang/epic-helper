import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {userService} from '../../../../models/user/user.service';
import {RPG_CLICKABLE_SLASH_COMMANDS} from '../../../../constants/epic_rpg/clickable_slash';
import {djsMessageHelper} from '../../../../lib/discord.js/message';

export default <PrefixCommand>{
  name: 'register',
  commands: ['register'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const created = await userService.registerUserAccount({
      userId: message.author.id,
      username: message.author.username,
      channelId: message.channel.id,
    });
    if (created) {
      djsMessageHelper.reply({
        client,
        message,
        options: `Successfully registered!\nUse ${RPG_CLICKABLE_SLASH_COMMANDS.inventory} to start tracking your ruby amount.`,
      });
    } else {
      djsMessageHelper.reply({
        client,
        message,
        options: `You have already registered!`,
      });
    }
  },
};
