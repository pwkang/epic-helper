import {Client} from 'discord.js';
import {handlerFileFilter, handlerRoot} from './constant';
import {importFiles} from '../../utils/filesImport';
import {logger} from '@epic-helper/utils';

async function loadPrefixCommands(client: Client) {
  const commands = await importFiles<PrefixCommand>({
    path: `./${handlerRoot}/commands/prefix`,
    options: {
      fileFilter: [handlerFileFilter],
    },
  });
  logger({
    message: `Loaded (${commands.length}) prefix commands`,
  });
  commands.forEach((command) => {
    if (!command?.name) return;
    client.prefixCommands.set(`${command.type}:${command.name}`, command);
  });
}

async function loadSlashCommands(client: Client) {
  const commands = await importFiles<SlashCommand>({
    path: `./${handlerRoot}/commands/slash`,
    options: {
      fileFilter: [handlerFileFilter, '!*.type.ts'],
      directoryFilter: ['!subcommand'],
    },
  });
  logger({
    message: `Loaded (${commands.length}) slash commands`,
  });
  commands.forEach((command) => {
    if (!command?.name) return;
    client.slashCommands.set(command.name, command);
  });
}

async function loadSlashMessages(client: Client) {
  const commands = await importFiles<SlashMessage>({
    path: `./${handlerRoot}/commands/slash-message`,
    options: {
      fileFilter: [handlerFileFilter],
    },
  });
  logger({
    message: `Loaded (${commands.length}) slash messages`,
  });
  commands.forEach((command) => {
    if (!command?.name) return;
    client.slashMessages.set(command.name, command);
  });
}

async function loadBotMessages(client: Client) {
  const commands = await importFiles<BotMessage>({
    path: `./${handlerRoot}/commands/bot-message`,
    options: {
      fileFilter: [handlerFileFilter],
    },
  });
  logger({
    message: `Loaded (${commands.length}) bot messages`,
  });
  commands.forEach((command) => {
    if (!command?.name) return;
    client.botMessages.set(command.name, command);
  });
}

export default function loadCommands(client: Client) {
  return Promise.all([
    loadPrefixCommands(client),
    loadSlashCommands(client),
    loadSlashMessages(client),
    loadBotMessages(client),
  ]);
}
