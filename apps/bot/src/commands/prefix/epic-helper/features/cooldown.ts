import embedsList from '../../../../lib/epic-helper/embeds';
import {djsMessageHelper} from '../../../../lib/discord.js/message';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {userReminderServices} from '../../../../services/database/user-reminder.service';

export default <PrefixCommand>{
  name: 'ehCooldown',
  commands: ['cooldowns', 'cooldown', 'cd'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const embed = embedsList.userCooldown({
      author: message.author,
      userReminder: await userReminderServices.getUserAllCooldowns(message.author.id),
    });
    await djsMessageHelper.send({
      channelId: message.channel.id,
      client,
      options: {embeds: [embed]},
    });
  },
};
