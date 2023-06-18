import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {userService} from '../../../../models/user/user.service';
import {djsMessageHelper} from '../../../../lib/discord.js/message';
import commandHelper from '../../../../lib/epic-helper/command-helper';

export default <PrefixCommand>{
  name: 'toggle',
  commands: ['toggle', 't'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const userToggle = await userService.getUserToggle(message.author.id);
    if (!userToggle) return;

    const donorToggleList = commandHelper.toggle.getDonorToggle(userToggle);
    const nonDonorToggleList = commandHelper.toggle.getNonDonorToggle(userToggle);
    const embed = commandHelper.toggle.renderEmbed({
      embedsInfo: donorToggleList,
      displayItem: 'common',
      embedAuthor: {
        name: `${message.author.username}'s toggle`,
        iconURL: message.author.avatarURL() ?? undefined,
      },
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
