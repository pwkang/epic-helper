import embedProvider from '../../../../lib/epic-helper/embeds';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {userReminderServices} from '@epic-helper/services';
import {userService} from '@epic-helper/services';
import toggleUserChecker from '../../../../lib/epic-helper/toggle-checker/user';

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
    const toggleChecker = await toggleUserChecker({
      userId: message.author.id,
      client,
      serverId: message.guild.id,
    });
    if (!userAccount || !toggleChecker) return;
    const embed = embedProvider.userCooldown({
      author: message.author,
      userReminder: await userReminderServices.getUserAllCooldowns(
        message.author.id,
      ),
      userAccount,
      toggleChecker,
    });
    await djsMessageHelper.send({
      channelId: message.channel.id,
      client,
      options: {embeds: [embed]},
    });
  },
};
