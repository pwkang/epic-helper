import type {EntryInfo} from 'readdirp';
import readdirp from 'readdirp';

function loadPrefixCommands(client: BotClient) {
  return new Promise((resolve, reject) => {
    readdirp('./src/commands/prefix', {fileFilter: '*.ts'})
      .on('data', async (entry: EntryInfo) => {
        const {fullPath} = entry;
        const file = await import(fullPath);
        const command = file.default.default as PrefixCommand;
        client.commands.set(command.name, command);
      })
      .on('end', () => {
        resolve({});
      });
  });
}

function loadSlashCommands(client: BotClient) {
  return new Promise((resolve, reject) => {
    readdirp('./src/commands/slash', {fileFilter: '*.ts'})
      .on('data', async (entry: EntryInfo) => {
        const {fullPath} = entry;
        const file = await import(fullPath);
        const command = file.default.default as SlashCommand;
        client.slashCommands.set(command.name, command);
      })
      .on('end', () => {
        resolve({});
      });
  });
}

export default function loadCommands(client: BotClient) {
  return Promise.all([loadPrefixCommands(client), loadSlashCommands(client)]);
}
