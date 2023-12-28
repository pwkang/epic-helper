import type {Client} from 'discord.js';
import {redisMainUsers} from '@epic-helper/services';

const loadMainUserOnReady = async (client: Client) => {
  const users = await redisMainUsers.get(client.cluster?.id);
  client.mainUsers = new Set(users);
};

export default loadMainUserOnReady;
