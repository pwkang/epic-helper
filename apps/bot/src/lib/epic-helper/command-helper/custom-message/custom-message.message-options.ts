import type {IUser} from '@epic-helper/models';
import type {BaseMessageOptions, Client, User} from 'discord.js';
import type {CUSTOM_MESSAGE_PAGE_TYPE} from './custom-message.constant';
import {_getCustomMessageEmbed} from './custom-message.embed';
import {_customMessagePageSelector} from './custom-message.components';
import type {IToggleUserCheckerReturnType} from '../../toggle-checker/user';
import type {ValuesOf} from '@epic-helper/types';

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
  const embed = _getCustomMessageEmbed({
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
