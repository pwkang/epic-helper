import commandHelper from '../../../../../lib/epic-helper/command-helper';
import {djsMessageHelper} from '../../../../../lib/discordjs/message';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {userService} from '../../../../../services/database/user.service';

export default <PrefixCommand>{
  name: 'toggleReset',
  commands: ['toggle reset', 't reset'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
  },
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
