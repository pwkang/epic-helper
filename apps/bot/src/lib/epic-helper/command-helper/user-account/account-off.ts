import type {BaseMessageOptions, User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import {userPetServices} from '../../../../services/database/user-pet.service';
import {BOT_COLOR} from '@epic-helper/constants';

interface ITurnOnAccount {
  author: User;
}

export const _turnOffAccount = async ({
  author,
}: ITurnOnAccount): Promise<BaseMessageOptions> => {
  await userService.userAccountOff(author.id);
  await userReminderServices.clearUserCooldowns(author.id);
  await userPetServices.resetUserPetsAdvStatus(author.id);
  return {
    embeds: [embed],
  };
};

const embed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setTitle('Successfully turned off the helper!')
  .addFields(
    {
      name: 'The following features have been disabled:',
      value:
        '- Reminder\n' +
        '- Pets tracking\n' +
        '- Training helper\n' +
        '- Update account commands\n' +
        '- Enchant mute helper\n',
    },
    {
      name: 'You can still use the following commands',
      value:
        '- Material calculator\n' +
        '- Guild reminder\n' +
        '- Guild duel logger\n',
    }
  );
