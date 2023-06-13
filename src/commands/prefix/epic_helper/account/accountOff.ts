import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {userService} from '../../../../models/user/user.service';
import {userReminderServices} from '../../../../models/user-reminder/user-reminder.service';
import {userPetServices} from '../../../../models/user-pet/user-pet.service';
import {djsMessageHelper} from '../../../../lib/discord.js/message';

export default <PrefixCommand>{
  name: 'accountOff',
  commands: ['off'],
  type: PREFIX_COMMAND_TYPE.bot,
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
