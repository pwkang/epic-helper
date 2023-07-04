import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {PREFIX_COMMAND_TYPE, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {userService} from '../../../../services/database/user.service';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import {userPetServices} from '../../../../services/database/user-pet.service';

export default <PrefixCommand>{
  name: 'accountOff',
  commands: ['off'],
  type: PREFIX_COMMAND_TYPE.bot,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.askToRegister,
  },
  execute: async (client, message) => {
    await userService.userAccountOff(message.author.id);
    await userReminderServices.clearUserCooldowns(message.author.id);
    await userPetServices.resetUserPetsAdvStatus(message.author.id);
    djsMessageHelper.reply({
      client,
      message,
      options: `Successfully turned off the helper!`,
    });
  },
};
