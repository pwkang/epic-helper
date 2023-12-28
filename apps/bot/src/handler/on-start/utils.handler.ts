import type {Client} from 'discord.js';
import {getUptime} from '../../utils/uptime';
import {djsMessageHelper} from '../../lib/discordjs/message';
import {redisMainUsers} from '@epic-helper/services';

export const registerUtilsFn = (client: Client) => {
  client.utils = {
    getUptime,
    djsMessageHelper,
    redis: {
      redisMainUsers,
    },
  };
  return Promise.resolve(client);
};
