import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {PREFIX_COMMAND_TYPE, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {userService} from '../../../../services/database/user.service';

export default <PrefixCommand>{
  name: 'accountHuntSwitch',
  commands: ['hunt switch', 'hs'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  execute: async (client, message) => {
    const newStatus = await userService.toggleHuntSwitch(message.author.id);

    const content = newStatus
      ? 'Switching hunt reminder message between **HUNT** and **HUNT TOGETHER**\nYou will now hunt with cooldown set in `donor`'
      : 'Stop switching reminder message between **HUNT** and **HUNT TOGETHER**\nYou will now hunt with cooldown set in `donorp`';
    djsMessageHelper.reply({
      client,
      message,
      options: {
        content,
      },
    });
  },
};
