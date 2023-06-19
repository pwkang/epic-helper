import type {IToggleEmbedsInfo} from './toggle.embed';
import {renderEmbed} from './toggle.embed';
import type {UpdateQuery} from 'mongoose';
import {User} from 'discord.js';
import {toggleDisplayList} from './toggle.list';
import {IUser, IUserToggle} from '@epic-helper/models';

interface IGetUpdateQuery {
  userToggle: IUserToggle;
  on?: string;
  off?: string;
  isDonor: boolean;
}

const regex1 = /^([a-z])([0-9]+)$/;
const regex2 = /^([a-z])([0-9]+)([a-z])$/;

const getUpdateQuery = ({userToggle, on, off, isDonor}: IGetUpdateQuery): UpdateQuery<IUser> => {
  const toggleInfo = isDonor
    ? toggleDisplayList.donor(userToggle)
    : toggleDisplayList.nonDonor(userToggle);
  const itemOn =
    on
      ?.toLowerCase()
      .split(' ')
      .filter((item) => regex1.test(item) || regex2.test(item))
      .map((item) => findPath(item, toggleInfo)) ?? [];
  const itemOff =
    off
      ?.toLowerCase()
      .split(' ')
      .filter((item) => regex1.test(item) || regex2.test(item))
      .map((item) => findPath(item, toggleInfo)) ?? [];

  const query: UpdateQuery<IUser> = {
    $set: {},
  };

  for (const item of itemOn) {
    if (!item) continue;
    query.$set![item] = true;
  }

  for (const item of itemOff) {
    if (!item) continue;
    query.$set![item] = false;
  }
  return query;
};

const findPath = (key: string, toggleInfo: IToggleEmbedsInfo[]): string | null => {
  const _key = regex1.test(key) ? key.match(regex1) : regex2.test(key) ? key.match(regex2) : null;
  if (!_key) return null;

  // convert a -> 0, b -> 1, c -> 2
  const index1 = _key[1].charCodeAt(0) - 97;
  const index2 = parseInt(_key[2]) - 1;
  const index3 = _key[3] ? _key[3].charCodeAt(0) - 97 : null;

  const path = toggleInfo[index1]?.children[index2] ?? null;

  if (!path) return null;

  if (index3 !== null && path.children) {
    return path.children[index3].path;
  } else {
    return path.path;
  }
};

interface IGetUserToggleEmbed {
  userToggle: IUserToggle;
  isDonor: boolean;
  author: User;
}

const getUserToggleEmbed = ({userToggle, isDonor, author}: IGetUserToggleEmbed) => {
  const toggleList = isDonor
    ? toggleDisplayList.donor(userToggle)
    : toggleDisplayList.nonDonor(userToggle);
  return renderEmbed({
    embedsInfo: toggleList,
    displayItem: 'common',
    embedAuthor: {
      name: `${author.username}'s toggle`,
      iconURL: author.avatarURL() ?? undefined,
    },
  });
};

const _toggleHelper = {
  getUserToggleEmbed,
  getUpdateQuery,
};

export default _toggleHelper;
