import {IUser} from '@epic-helper/models';
import {BaseMessageOptions, Client, User} from 'discord.js';
import {CUSTOM_MESSAGE_PAGE_TYPE} from './custom-message.constant';
import {_getCustomMessageEmbed} from './custom-message.embed';
import {_customMessagePageSelector} from './custom-message.components';

export interface IGetMessageOptions {
  client: Client;
  userAccount: IUser;
  author: User;
  pageType?: ValuesOf<typeof CUSTOM_MESSAGE_PAGE_TYPE>;
}

export const _getMessageOptions = async ({
  client,
  userAccount,
  author,
  pageType,
}: IGetMessageOptions): Promise<BaseMessageOptions> => {
  const embed = await _getCustomMessageEmbed({
    client,
    userAccount,
    author,
    pageType,
  });
  const buttonRows = _customMessagePageSelector({
    pageType,
  });
  return {
    embeds: [embed],
    components: [buttonRows],
  };
};
