import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';
import {userService} from '../../../../services/database/user.service';

export default <PrefixCommand>{
  name: 'accountOn',
  commands: ['on'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
  },
  execute: async (client, message) => {
    await userService.userAccountOn(message.author.id);
    djsMessageHelper.reply({
      client,
      message,
      options: `Successfully turned on the helper!`,
    });
  },
};
