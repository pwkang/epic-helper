import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {userService} from '../../../../models/user/user.service';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discord.js/message';

export default <PrefixCommand>{
  name: 'toggleReset',
  commands: ['toggle reset', 't reset'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const userToggle = await userService.resetUserToggle({
      userId: message.author.id,
    });
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
