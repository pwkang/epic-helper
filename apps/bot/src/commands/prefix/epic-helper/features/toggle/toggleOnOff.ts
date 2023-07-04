import commandHelper from '../../../../../lib/epic-helper/command-helper';
import {djsMessageHelper} from '../../../../../lib/discordjs/message';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {userService} from '../../../../../services/database/user.service';
import {toggleDisplayList} from '../../../../../lib/epic-helper/command-helper/toggle/toggle.list';
import {IUser} from '@epic-helper/models';

export default <PrefixCommand>{
  name: 'toggleOnOff',
  commands: ['toggle on', 'toggle off', 't on', 't off'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.askToTurnOn,
  },
  execute: async (client, message, args) => {
    const status = args[1] === 'on';
    let userAccount = await userService.getUserAccount(message.author.id);
    if (!userAccount) return;

    const query = commandHelper.toggle.getUpdateQuery<IUser>({
      on: status ? message.content : undefined,
      off: status ? undefined : message.content,
      toggleInfo: toggleDisplayList.donor(userAccount.toggle),
    });
    userAccount = await userService.updateUserToggle({
      query,
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
