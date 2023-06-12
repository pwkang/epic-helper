import type {EntryInfo} from 'readdirp';
import readdirp from 'readdirp';
import {Client} from 'discord.js';
import {handlerFileFilter, handlerRoot} from './constant';

function loadPrefixCommands(client: Client) {
  return new Promise((resolve) => {
    readdirp(`./${handlerRoot}/commands/prefix`, {fileFilter: handlerFileFilter})
      .on('data', async (entry: EntryInfo) => {
        const {fullPath} = entry;
        const file = await import(fullPath);
        const command = file.default.default as PrefixCommand;
        if (!command?.name) return;
        client.prefixCommands.set(`${command.type}:${command.name}`, command);
      })
      .on('end', () => {
        resolve({});
      });
  });
}

function loadSlashCommands(client: Client) {
  return new Promise((resolve) => {
    readdirp(`./${handlerRoot}/commands/slash`, {
      fileFilter: [handlerFileFilter, '!*.type.ts'],
      directoryFilter: ['!subcommand'],
    })
      .on('data', async (entry: EntryInfo) => {
        const {fullPath} = entry;
        const file = await import(fullPath);
        const command = file.default.default;
        if (!command || !('name' in command)) return;
        client.slashCommands.set(command.name, command);
      })
      .on('end', () => {
        resolve({});
      });
  });
}

function loadSlashMessages(client: Client) {
  return new Promise((resolve) => {
    readdirp(`./${handlerRoot}/commands/slash_other_bot`, {
      fileFilter: [handlerFileFilter],
    })
      .on('data', async (entry: EntryInfo) => {
        const {fullPath} = entry;
        const file = await import(fullPath);
        const command = file.default.default;
        if (!command || !('name' in command)) return;
        client.slashMessages.set(command.name, command);
      })
      .on('end', () => {
        resolve({});
      });
  });
}

export default function loadCommands(client: Client) {
  return Promise.all([
    loadPrefixCommands(client),
    loadSlashCommands(client),
    loadSlashMessages(client),
  ]);
}
