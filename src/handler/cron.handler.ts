import {Client} from 'discord.js';
import readdirp, {EntryInfo} from 'readdirp';
import {schedule} from 'node-cron';

export default function loadCronJob(client: Client) {
  return new Promise((resolve) => {
    readdirp('./src/cron', {fileFilter: '*.ts'})
      .on('data', async (entry: EntryInfo) => {
        const {fullPath} = entry;
        const file = await import(fullPath);
        const command = file.default.default as CronJob;
        if (!command?.name || command.disabled) return;
        schedule(command.expression, () => command.execute(client), command.cronOptions);
      })
      .on('end', () => {
        resolve({});
      });
  });
}
