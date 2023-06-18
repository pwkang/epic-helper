import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import commandHelper from '../../../../lib/epic-helper/command-helper';
import {userService} from '../../../../models/user/user.service';
import {djsMessageHelper} from '../../../../lib/discord.js/message';

export default <PrefixCommand>{
  name: 'toggleOnOff',
  commands: ['toggle on', 'toggle off', 't on', 't off'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message, args) => {
    const status = args[1] === 'on';
    let userToggle = await userService.getUserToggle(message.author.id);
    if (!userToggle) return;

    const query = commandHelper.toggle.getUpdateQuery({
      toggleInfo: commandHelper.toggle.getDonorToggle(userToggle),
      on: status ? message.content : undefined,
      off: status ? undefined : message.content,
    });
    userToggle = await userService.updateUserToggle({
      query,
      userId: message.author.id,
    });
    if (!userToggle) return;
    const embed = commandHelper.toggle.renderEmbed({
      embedsInfo: commandHelper.toggle.getDonorToggle(userToggle),
      displayItem: commandHelper.toggle.userToggleType.common,
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
