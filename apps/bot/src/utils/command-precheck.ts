import {Client, User} from 'discord.js';
import {userService} from '../services/database/user.service';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import embedProvider from '../lib/epic-helper/embeds';
import {djsMessageHelper} from '../lib/discordjs/message';
import {ICommandPreCheck} from '../types/utils';

interface IPreCheckCommand {
  client: Client;
  preCheck: ICommandPreCheck;
  author: User;
  channelId: string;
}

export const preCheckCommand = async ({preCheck, author, channelId, client}: IPreCheckCommand) => {
  const status: Record<keyof PrefixCommand['preCheck'], boolean> = {
    userNotRegistered: true,
    userAccOff: true,
  };
  const userAccount = await userService.getUserAccount(author.id);
  if (preCheck.userNotRegistered !== undefined) {
    switch (preCheck.userNotRegistered) {
      case USER_NOT_REGISTERED_ACTIONS.skip:
        status.userNotRegistered = true;
        break;
      case USER_NOT_REGISTERED_ACTIONS.abort:
        status.userNotRegistered = !!userAccount;
        break;
      case USER_NOT_REGISTERED_ACTIONS.askToRegister:
        status.userNotRegistered = !!userAccount;
        if (!userAccount)
          await djsMessageHelper.send({
            client,
            channelId,
            options: {
              embeds: [
                embedProvider.howToRegister({
                  author: author,
                }),
              ],
            },
          });
        break;
    }
  }

  if (preCheck.userAccOff !== undefined) {
    switch (preCheck.userAccOff) {
      case USER_ACC_OFF_ACTIONS.skip:
        status.userAccOff = true;
        break;
      case USER_ACC_OFF_ACTIONS.abort:
        status.userAccOff = !!userAccount?.config.onOff;
        break;
      case USER_ACC_OFF_ACTIONS.askToTurnOn:
        status.userAccOff = !!userAccount && !!userAccount?.config.onOff;
        if (!!userAccount && !userAccount?.config.onOff)
          await djsMessageHelper.send({
            client,
            channelId,
            options: {
              embeds: [embedProvider.turnOnAccount()],
            },
          });
        break;
    }
  }

  return Object.values(status).every((value) => value);
};
