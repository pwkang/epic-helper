import type {Message, User} from 'discord.js';
import {searchCmdByKeyword} from '../../../../utils/search-cmd-by-keyword';
import {userService} from '@epic-helper/services';

const MAX_USERS = 5;

interface IVSetGroupCooldowns {
  author: User;
  message: Message;
}

export const _setGroupCooldowns = async ({author, message}: IVSetGroupCooldowns) => {
  const commandTypes = searchCmdByKeyword(message.content);
  const users = message.mentions.users.filter(user => user.id !== author.id && !user.bot);
  const userAccount = await userService.getUserAccount(author.id);
  if(!userAccount) return null;
  const usersToView = new Set<string>();

  for (const {userId} of userAccount.groupCooldowns) {
    usersToView.add(userId);
  }
  for(const user of users.values()) {
    usersToView.add(user.id);
  }

  if (!users.size) {
    return {
      content: 'Please mention at least one user',
    };
  }

  if (!commandTypes.length) {
    return {
      content: 'Please provide at least one command type',
    };
  }

  if (usersToView.size > MAX_USERS) {
    return {
      content: `You can only set cooldowns for ${MAX_USERS} users at a time`,
    };
  }

  // for (const [userId, user] of users.entries()) {
  //   const isRegistered = await userService.isUserAccountExist(userId);
  //   if (!isRegistered) {
  //     return {
  //       content: `**${user.username}** is not registered yet`,
  //     };
  //   }
  // }

  await userService.saveUserGroupCooldowns({
    users: users.map(user => user.id),
    types: commandTypes,
    userId: author.id,
  });

  return {
    content: 'Successfully set group cooldowns',
  };
};
