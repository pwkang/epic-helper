import {djsMessageHelper} from '../../../../lib/discord.js/message';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {userPetServices, userReminderServices, userService} from '@epic-helper/models';

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
