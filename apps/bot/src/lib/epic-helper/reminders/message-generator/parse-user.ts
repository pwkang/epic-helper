import type {Client} from 'discord.js';

interface IParseUser {
  client: Client;
  userId: string;
  type: 'mentions' | 'username';
}

export const _parseUser = ({userId, client, type}: IParseUser) => {
  const user = client.users.cache.get(userId);
  if (type === 'mentions') return `<@${userId}>`;
  if (user && type === 'username') return user.username;
  return userId;
};
