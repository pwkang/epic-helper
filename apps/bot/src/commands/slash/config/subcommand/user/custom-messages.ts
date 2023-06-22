import {IUserConfig} from '../config.type';
import djsInteractionHelper from '../../../../../lib/discordjs/interaction';
import {userService} from '../../../../../services/database/user.service';

export const setCustomMessages = async ({client, interaction}: IUserConfig) => {
  const customMessage = await userService.getUserReminderMessage({
    userId: interaction.user.id,
  });
  console.log(customMessage);
  djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: {
      content: 'Not implemented yet',
    },
  });
};
