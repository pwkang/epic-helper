import {BaseMessageOptions, User} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {djsMessageHelper} from '../../../discordjs/message';
import embedProvider from '../../embeds';

interface IRegisterAccount {
  author: User;
  channelId: string;
}

export const _registerAccount = async ({
  author,
  channelId,
}: IRegisterAccount): Promise<BaseMessageOptions> => {
  const created = await userService.registerUserAccount({
    userId: author.id,
    username: author.username,
    channelId,
  });
  if (created) {
    return {
      embeds: [embedProvider.successfullyRegister()],
    };
  } else {
    return {
      content: `You have already registered!`,
    };
  }
};
