import type {EntryInfo} from 'readdirp';
import readdirp from 'readdirp';
import {Client} from 'discord.js';

function loadPrefixCommands(client: Client) {
  return new Promise((resolve, reject) => {
    readdirp('./src/commands/prefix', {fileFilter: '*.ts'})
      .on('data', async (entry: EntryInfo) => {
        const {fullPath} = entry;
        const file = await import(fullPath);
        const command = file.default.default as PrefixCommand;
        if (!command.name) return;
        client.prefixCommands.set(`${command.type}:${command.name}`, command);
      })
      .on('end', () => {
        resolve({});
      });
  });
}

function loadSlashCommands(client: Client) {
  return new Promise((resolve, reject) => {
    readdirp('./src/commands/slash', {fileFilter: '*.ts'})
      .on('data', async (entry: EntryInfo) => {
        const {fullPath} = entry;
        const file = await import(fullPath);
        const command = file.default.default as SlashCommand;
        if (!command.name) return;
        client.slashCommands.set(command.name, command);
      })
      .on('end', () => {
        resolve({});
      });
  });
}

export default function loadCommands(client: Client) {
  return Promise.all([loadPrefixCommands(client), loadSlashCommands(client)]);
}
