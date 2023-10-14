import type {Client} from 'discord.js';
import {getUptime} from '../../utils/uptime';

export const registerUtilsFn = (client: Client) => {
  client.utils = {
    getUptime
  };
  return Promise.resolve(client);
};
