import {BaseMessageOptions, User} from 'discord.js';
import {userService} from '../../../../services/database/user.service';

interface ITurnOnAccount {
  author: User;
}

export const _turnOnAccount = async ({author}: ITurnOnAccount): Promise<BaseMessageOptions> => {
  await userService.userAccountOn(author.id);
  return {
    content: 'Successfully turned on the helper!',
  };
};
