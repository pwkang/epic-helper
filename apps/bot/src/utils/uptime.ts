import type {Client} from 'discord.js';

export const getUptime = (client: Client): string => {
  const uptime = client.uptime ?? 0;
  const days = Math.floor(uptime / 86400000);
  const hours = Math.floor(uptime / 3600000) % 24;
  const minutes = Math.floor(uptime / 60000) % 60;
  const seconds = Math.floor(uptime / 1000) % 60;

  let str = '';
  if (days > 0) str += `${days}d `;
  if (hours > 0) str += `${hours}h `;
  if (minutes > 0) str += `${minutes}m `;
  if (seconds > 0) str += `${seconds}s `;
  if (str === '') str = '0s';

  return str.trim();
};
