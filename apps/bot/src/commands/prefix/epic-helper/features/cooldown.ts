import embedProvider from '../../../../lib/epic-helper/embeds';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import {userService} from '../../../../services/database/user.service';

export default <PrefixCommand>{
  name: 'ehCooldown',
  commands: ['cooldowns', 'cooldown', 'cd'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
  },
  execute: async (client, message) => {
    const userAccount = await userService.getUserAccount(message.author.id);
    if (!userAccount) return;
    const embed = embedProvider.userCooldown({
      author: message.author,
      userReminder: await userReminderServices.getUserAllCooldowns(message.author.id),
      userAccount,
    });
    await djsMessageHelper.send({
      channelId: message.channel.id,
      client,
      options: {embeds: [embed]},
    });
  },
};
