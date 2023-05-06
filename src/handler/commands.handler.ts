import readdirp from 'readdirp';
import type {EntryInfo} from 'readdirp';

export default function loadPrefixCommands(client: BotClient) {
  readdirp('./src/commands/prefix', {fileFilter: '*.ts'}).on('data', async (entry: EntryInfo) => {
    const {fullPath} = entry;
    const file = await import(fullPath);
    const command = file.default.default as PrefixCommand;
    client.commands.set(command.name, command);
  });
}
