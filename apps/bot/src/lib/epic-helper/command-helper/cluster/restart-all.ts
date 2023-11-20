import type {Client} from 'discord.js';

export const _restartAll = async (client: Client) => {
  await client.cluster?.send({
    action: 'restartAll',
  });
};
