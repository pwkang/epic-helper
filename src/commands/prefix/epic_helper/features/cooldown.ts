import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {getUserAllCooldowns} from '../../../../models/user-reminder/user-reminder.service';
import sendMessage from '../../../../lib/discord.js/message/sendMessage';
import embedsList from '../../../../lib/epic_helper/embeds';

export default <PrefixCommand>{
  name: 'ehCooldown',
  commands: ['cooldowns', 'cooldown', 'cd'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const embed = embedsList.userCooldown({
      author: message.author,
      userReminder: await getUserAllCooldowns(message.author.id),
    });
    await sendMessage({
      channelId: message.channel.id,
      client,
      options: {embeds: [embed]},
    });
  },
};
