import {djsMessageHelper} from '../../../../lib/discord.js/message';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {userService} from '../../../../services/database/user.service';

export default <PrefixCommand>{
  name: 'toggle',
  commands: ['toggle', 't'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const userToggle = await userService.getUserToggle(message.author.id);
    if (!userToggle) return;

    const embed = commandHelper.toggle.getUserToggleEmbed({
      isDonor: true,
      author: message.author,
      userToggle,
    });
    await djsMessageHelper.send({
      client,
      channelId: message.channel.id,
      options: {
        embeds: [embed],
      },
    });
  },
};
