import type {IToggleEmbedsInfo} from './toggle.embed';
import {renderEmbed} from './toggle.embed';
import type {UpdateQuery} from 'mongoose';
import {Guild, User} from 'discord.js';
import {toggleDisplayList} from './toggle.list';
import {IGuild, IUser, IUserToggle} from '@epic-helper/models';
import {PREFIX} from '@epic-helper/constants';

export interface IGetUpdateQuery {
  on?: string;
  off?: string;
  toggleInfo: IToggleEmbedsInfo[];
}

const regex1 = /^([a-z])([0-9]+)$/;
const regex2 = /^([a-z])([0-9]+)([a-z])$/;

const getUpdateQuery = <T>({on, off, toggleInfo}: IGetUpdateQuery): UpdateQuery<T> => {
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

interface IGetDonorToggleEmbed {
  userAccount: IUser;
  author: User;
}

const getDonorToggleEmbed = ({userAccount, author}: IGetDonorToggleEmbed) => {
  const userToggle = userAccount.toggle;
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
      > *\`${PREFIX.bot}t on a1 a5 b3a\`*
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

const _toggleHelper = {
  getDonorToggleEmbed,
  getNonDonorToggleEmbed,
  getUpdateQuery,
  getGuildToggleEmbed,
};

export default _toggleHelper;
