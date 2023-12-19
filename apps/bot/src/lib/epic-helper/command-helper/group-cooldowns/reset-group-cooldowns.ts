import type {User} from 'discord.js';
import {userService} from '@epic-helper/services';

interface IResetGroupCooldowns {
  author: User;
}

export const _resetGroupCooldowns = async ({author}: IResetGroupCooldowns) => {
  await userService.resetGroupCooldowns({
    userId: author.id,
  });

  return {
    content: 'Successfully set group cooldowns',
  };
};
