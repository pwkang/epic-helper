import {IUser} from '@epic-helper/models';
import {BaseMessageOptions, Client, User} from 'discord.js';
import {CUSTOM_MESSAGE_PAGE_TYPE} from './custom-message.constant';
import {_getCustomMessageEmbed} from './custom-message.embed';
import {_customMessagePageSelector} from './custom-message.components';
import {IToggleUserCheckerReturnType} from '../../toggle-checker/user';

export interface IGetMessageOptions {
  client: Client;
  userAccount: IUser;
  author: User;
  pageType?: ValuesOf<typeof CUSTOM_MESSAGE_PAGE_TYPE>;
  toggleChecker: IToggleUserCheckerReturnType;
}

export const _getMessageOptions = async ({
  client,
  userAccount,
  author,
  pageType,
  toggleChecker,
}: IGetMessageOptions): Promise<BaseMessageOptions> => {
  const embed = await _getCustomMessageEmbed({
    client,
    userAccount,
    author,
    pageType,
    toggleChecker,
  });
  const buttonRows = _customMessagePageSelector({
    pageType,
  });
  return {
    embeds: [embed],
    components: [buttonRows],
  };
};
