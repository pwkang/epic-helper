import readdirp, {EntryInfo} from 'readdirp';
import {Client} from 'discord.js';

export default function loadBotEvents(client: Client) {
  return new Promise((resolve) => {
    readdirp('./src/events', {fileFilter: '*.ts'})
      .on('data', async (entry: EntryInfo) => {
        const {fullPath} = entry;
        const file = await import(fullPath);
        const command = file.default.default as BotEvent;
        if (!command?.eventName) return;
        if (command.once) {
          client.once(command.eventName as keyof BotEvent, (...args) =>
            command.execute(client, ...args)
          );
        } else {
          client.on(command.eventName as keyof BotEvent, (...args) =>
            command.execute(client, ...args)
          );
        }
      })
      .on('end', () => {
        resolve({});
      });
  });
}
