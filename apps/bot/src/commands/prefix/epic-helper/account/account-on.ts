import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {userService} from '../../../../models/user/user.service';
import {djsMessageHelper} from '../../../../lib/discord.js/message';

export default <PrefixCommand>{
  name: 'accountOn',
  commands: ['on'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    await userService.userAccountOn(message.author.id);
    djsMessageHelper.reply({
      client,
      message,
      options: `Successfully turned on the helper!`,
    });
  },
};
