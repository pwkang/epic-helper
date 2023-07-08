import {BaseMessageOptions, User} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import {userPetServices} from '../../../../services/database/user-pet.service';

interface ITurnOnAccount {
  author: User;
}

export const _turnOffAccount = async ({author}: ITurnOnAccount): Promise<BaseMessageOptions> => {
  await userService.userAccountOff(author.id);
  await userReminderServices.clearUserCooldowns(author.id);
  await userPetServices.resetUserPetsAdvStatus(author.id);
  return {
    content: 'Successfully turned of the helper!',
  };
};
