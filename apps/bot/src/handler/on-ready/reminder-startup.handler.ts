import type {Client} from 'discord.js';
import {redisMainUsers, userService} from '@epic-helper/services';

const loadMainUserOnReady = async (client: Client) => {
  const users = await redisMainUsers.get(client.cluster?.id);
  if(!users.length) {
    const usersId = await userService.getUserByChannelIds({
      channelIds: Array.from(client.channels.cache.keys()),
    });
    users.push(...usersId);
  }
  client.mainUsers = new Set(users);
};

export default loadMainUserOnReady;
