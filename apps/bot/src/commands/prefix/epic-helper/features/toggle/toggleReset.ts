import commandHelper from '../../../../../lib/epic-helper/command-helper';
import {djsMessageHelper} from '../../../../../lib/discordjs/message';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {userService} from '../../../../../services/database/user.service';

export default <PrefixCommand>{
  name: 'toggleReset',
  commands: ['toggle reset', 't reset'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const userAccount = await userService.resetUserToggle({
      userId: message.author.id,
    });
    if (!userAccount) return;

    const embed = commandHelper.toggle.getDonorToggleEmbed({
      author: message.author,
      userAccount,
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
