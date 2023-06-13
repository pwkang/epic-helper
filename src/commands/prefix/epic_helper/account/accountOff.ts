import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {userAccountOff} from '../../../../models/user/user.service';
import {clearUserCooldowns} from '../../../../models/user-reminder/user-reminder.service';
import {resetUserPetsAdvStatus} from '../../../../models/user-pet/user-pet.service';
import {djsMessageHelper} from '../../../../lib/discord.js/message';

export default <PrefixCommand>{
  name: 'accountOff',
  commands: ['off'],
  type: PREFIX_COMMAND_TYPE.bot,
  execute: async (client, message) => {
    await userAccountOff(message.author.id);
    await clearUserCooldowns(message.author.id);
    await resetUserPetsAdvStatus(message.author.id);
    djsMessageHelper.reply({
      client,
      message,
      options: `Successfully turned off the helper!`,
    });
  },
};
