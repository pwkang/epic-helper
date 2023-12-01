import type {User} from 'discord.js';

const isSuccess = (content: string, author: User) =>
  [author.username, 'drinks', 'sleepy potion'].every((text) => content.includes(text));

export const _sleepyPotionMessageChecker = {
  isSuccess,
};
