import {Client} from 'discord.js';
import {handlerFileFilter, handlerRoot} from './constant';
import {importFiles} from '../../utils/filesImport';
import pino from 'pino';
import {logger} from '@epic-helper/utils';

export default async function loadBotEvents(client: Client) {
  const commands = await importFiles<BotEvent>({
    path: `./${handlerRoot}/events`,
    options: {
      fileFilter: [handlerFileFilter],
    },
  });
  logger({
    client,
    message: `Loaded (${commands.length}) bot events`,
  });
  commands.forEach((command) => {
    if (!command?.eventName) return;
    if (command.once) {
      client.once(command.eventName, (...args) => command.execute(client, ...args));
    } else {
      client.on(command.eventName, (...args) => command.execute(client, ...args));
    }
  });
}
