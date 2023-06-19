import commandHelper from '../../../../lib/epic-helper/command-helper';
import {djsMessageHelper} from '../../../../lib/discord.js/message';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {userService} from '@epic-helper/models';

export default <PrefixCommand>{
  name: 'toggleOnOff',
  commands: ['toggle on', 'toggle off', 't on', 't off'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message, args) => {
    const status = args[1] === 'on';
    let userToggle = await userService.getUserToggle(message.author.id);
    if (!userToggle) return;

    const query = commandHelper.toggle.getUpdateQuery({
      userToggle,
      on: status ? message.content : undefined,
      off: status ? undefined : message.content,
      isDonor: true,
    });
    userToggle = await userService.updateUserToggle({
      query,
      userId: message.author.id,
    });
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
