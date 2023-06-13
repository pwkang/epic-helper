import {ApplicationCommand, Client, Routes} from 'discord.js';
import {djsRestClient} from '../../../services/discord.js/discordjs.service.ts';

interface IGetGlobalSlashCommands {
  client: Client;
}

export const _getGlobalSlashCommands = async ({client}: IGetGlobalSlashCommands) => {
  if (!client.user) return [];
  try {
    const data = await djsRestClient.get(Routes.applicationCommands(client.user.id));

    return data as ApplicationCommand[];
  } catch (e) {
    console.error(e);
    return [];
  }
};
