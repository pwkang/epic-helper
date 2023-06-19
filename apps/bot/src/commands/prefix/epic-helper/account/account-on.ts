import {djsMessageHelper} from '../../../../lib/discord.js/message';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {userService} from '@epic-helper/models';

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
