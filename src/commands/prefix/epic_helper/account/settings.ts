import {COMMAND_TYPE} from '../../../../constants/bot';
import {getUserSettingsEmbed} from '../../../../lib/embeds/getUserSettingsEmbed';
import {getUserAccount} from '../../../../models/user/user.service';
import sendMessage from '../../../../lib/discord.js/message/sendMessage';

export default <PrefixCommand>{
  name: 'settings',
  commands: ['settings', 's'],
  type: COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const userProfile = await getUserAccount(message.author.id);
    if (!userProfile) return;
    const embed = getUserSettingsEmbed({
      client,
      author: message.author,
      userProfile,
    });
    await sendMessage({
      client,
      channelId: message.channel.id,
      options: {
        embeds: [embed],
      },
    });
  },
};
