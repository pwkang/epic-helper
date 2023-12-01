import type {User} from 'discord.js';

const isChimneySuccess = (content: string, author: User) =>
  [author.username, 'went through a chimney'].every((text) => content.includes(text));

export const _xmasMessageChecker = {
  isChimneySuccess,
};
