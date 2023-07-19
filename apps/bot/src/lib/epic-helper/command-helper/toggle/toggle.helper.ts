import type {IToggleEmbedsInfo} from './toggle.embed';
import {renderEmbed} from './toggle.embed';
import type {UpdateQuery} from 'mongoose';
import {BaseMessageOptions, User} from 'discord.js';
import {toggleDisplayList} from './toggle.list';
import {IGuild, IUser, IUserToggle} from '@epic-helper/models';
import {PREFIX} from '@epic-helper/constants';
import {userService} from '../../../../services/database/user.service';
import donorChecker from '../../donor-checker';
import commandHelper from '../index';

export interface IGetUpdateQuery {
  on?: string;
  off?: string;
  toggleInfo: IToggleEmbedsInfo[];
}

const regexParent = /^([a-z])([0-9]+)$/;
const regexChild = /^([a-z])([0-9]+)([a-z])$/;
const regexRange = /^([a-z])([0-9]+)-([a-z])([0-9]+)$/;

const filterKeyword = (keyword: string): string[] =>
  keyword
    .toLowerCase()
    .split(' ')
    .filter((item) => regexParent.test(item) || regexChild.test(item) || regexRange);

const getUpdateQuery = <T>({on, off, toggleInfo}: IGetUpdateQuery): UpdateQuery<T> => {
  const itemOn = on
    ? filterKeyword(on).flatMap((item) => getPathsFromKeyword(item, toggleInfo))
    : [];
  const itemOff = off
    ? filterKeyword(off).flatMap((item) => getPathsFromKeyword(item, toggleInfo))
    : [];
  const query: Record<string, boolean> = {};

  for (const item of itemOn) {
    if (!item) continue;
    query[item] = true;
  }

  for (const item of itemOff) {
    if (!item) continue;
    query[item] = false;
  }
  return {
    $set: query,
  };
};

const getPathsFromKeyword = (
  key: string,
  toggleInfo: IToggleEmbedsInfo[]
): string | string[] | null => {
  if (regexParent.test(key)) {
    const _key = key.match(regexParent);
    if (!_key) return null;
    return findPath({
      toggleInfo,
      groupIndex: parseGroupIndex(_key[1]),
      parentIndex: parseParentIndex(_key[2]),
    });
  } else if (regexChild.test(key)) {
    const _key = key.match(regexChild);
    if (!_key) return null;
    return findPath({
      toggleInfo,
      groupIndex: parseGroupIndex(_key[1]),
      parentIndex: parseParentIndex(_key[2]),
      childIndex: parseChildIndex(_key[3]),
    });
  } else if (regexRange.test(key)) {
    const _key = key.match(regexRange);
    if (!_key) return null;
    const fromGroupIndex = parseGroupIndex(_key[1]);
    const fromParentIndex = parseParentIndex(_key[2]);
    const toGroupIndex = parseGroupIndex(_key[3]);
    const toParentIndex = parseParentIndex(_key[4]);
    if (fromGroupIndex !== toGroupIndex) return null;
    const items = [];
    for (let i = fromParentIndex; i <= toParentIndex; i++) {
      const path = findPath({
        toggleInfo,
        groupIndex: fromGroupIndex,
        parentIndex: i,
      });
      if (path) items.push(path);
    }
    return items;
  }
  return null;
};

const parseGroupIndex = (key: string): number => key.charCodeAt(0) - 97;
const parseParentIndex = (key: string): number => parseInt(key) - 1;
const parseChildIndex = (key: string): number => key.charCodeAt(0) - 97;

interface IFindPath {
  toggleInfo: IToggleEmbedsInfo[];
  groupIndex: number;
  parentIndex: number;
  childIndex?: number;
}

const findPath = ({toggleInfo, groupIndex, parentIndex, childIndex}: IFindPath): string | null => {
  const parent = toggleInfo[groupIndex]?.children[parentIndex] ?? null;

  if (!parent) return null;

  if (childIndex !== undefined) {
    return parent.children?.[childIndex]?.path ?? null;
  }

  return parent.path;
};

interface IGetDonorToggleEmbed {
  userToggle: IUserToggle;
  author: User;
}

const getDonorToggleEmbed = ({userToggle, author}: IGetDonorToggleEmbed) => {
  return renderEmbed({
    embedsInfo: toggleDisplayList.donor(userToggle),
    displayItem: 'common',
  })
    .setAuthor({
      name: `${author.username}'s toggle`,
      iconURL: author.avatarURL() ?? undefined,
    })
    .setDescription(
      `**Syntax 1:** \`${PREFIX.bot}t <on/off> <ID> [ID] [ID]\` - turn on/off any settings
      > *\`${PREFIX.bot}t on a1 a5 b3a c2-c5\`*
      **Syntax 2:** \`${PREFIX.bot}t reset\` - reset all settings`
    );
};

interface IGetNonDonorToggleEmbed {
  userToggle: IUserToggle;
  author: User;
}

const getNonDonorToggleEmbed = ({userToggle, author}: IGetNonDonorToggleEmbed) => {
  return renderEmbed({
    embedsInfo: toggleDisplayList.nonDonor(userToggle),
    displayItem: 'common',
  }).setAuthor({
    name: `${author.username}'s toggle`,
    iconURL: author.avatarURL() ?? undefined,
  });
};

interface IGetGuildToggleEmbed {
  guildAccount: IGuild;
}

const getGuildToggleEmbed = ({guildAccount}: IGetGuildToggleEmbed) => {
  return renderEmbed({
    embedsInfo: toggleDisplayList.guild(guildAccount.toggle),
    displayItem: 'common',
  }).setAuthor({
    name: `${guildAccount.info.name ?? ''} Toggle Settings`,
  });
};

interface IGetUserToggle {
  author: User;
}

interface IUpdateToggle {
  on?: string;
  off?: string;
}

const getUserToggle = async ({author}: IGetUserToggle) => {
  let userToggle = await userService.getUserToggle(author.id);
  if (!userToggle) return null;
  const isDonor = await donorChecker.isDonor({
    userId: author.id,
  });

  function render(userToggle: IUserToggle): BaseMessageOptions {
    const embed = getEmbed(userToggle);
    return {
      embeds: [embed],
    };
  }

  function getEmbed(userToggle: IUserToggle) {
    return isDonor
      ? getDonorToggleEmbed({
          author,
          userToggle,
        })
      : getNonDonorToggleEmbed({
          author,
          userToggle,
        });
  }

  async function update({on, off}: IUpdateToggle) {
    const query = commandHelper.toggle.getUpdateQuery<IUser>({
      on,
      off,
      toggleInfo: isDonor
        ? toggleDisplayList.donor(userToggle!)
        : toggleDisplayList.nonDonor(userToggle!),
    });
    const userAccount = await userService.updateUserToggle({
      query,
      userId: author.id,
    });
    if (!userAccount) return null;
    userToggle = userAccount.toggle;
    return render(userToggle);
  }

  return {
    render: () => render(userToggle!),
    update,
  };
};

export const _toggleHelper = {
  getUpdateQuery,
  getGuildToggleEmbed,
  user: getUserToggle,
};
