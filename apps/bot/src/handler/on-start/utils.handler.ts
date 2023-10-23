import type {Client} from 'discord.js';
import {getUptime} from '../../utils/uptime';
import {djsMessageHelper} from '../../lib/discordjs/message';

export const registerUtilsFn = (client: Client) => {
  client.utils = {
    getUptime,
    djsMessageHelper,
  };
  return Promise.resolve(client);
};
