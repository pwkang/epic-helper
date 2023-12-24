import type {Message, User} from 'discord.js';
import {userService} from '@epic-helper/services';


interface IRemoveGroupCooldownsUsers {
  author: User;
  message: Message;
}

export const _removeGroupCooldownsUsers = async ({author, message}: IRemoveGroupCooldownsUsers) => {
  const users = message.mentions.users.filter(user => user.id !== author.id && !user.bot);
  const userAccount = await userService.getUserAccount(author.id);
  if (!userAccount) return null;

  if(userAccount.groupCooldowns.every(cd => !users.has(cd.userId))) {
    return {
      content: 'None of the mentioned users are in your group cooldowns',
    };
  }

  await userService.removeUsersFromGroupCooldowns({
    users: users.map(user => user.id),
    userId: author.id,
  });

  return {
    content: 'Successfully remove users from group cooldowns',
  };
};
