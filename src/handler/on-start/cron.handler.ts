import {Client} from 'discord.js';
import {schedule} from 'node-cron';
import {handlerFileFilter, handlerRoot} from './constant';
import {importFiles} from '../../utils/filesImport';

export default async function loadCronJob(client: Client) {
  const commands = await importFiles<CronJob>({
    path: `./${handlerRoot}/cron`,
    options: {
      fileFilter: [handlerFileFilter],
    },
  });
  console.log(`Loaded ${commands.length} cron jobs`);
  commands.forEach((command) => {
    if (!command?.name || command.disabled) return;
    schedule(command.expression, () => command.execute(client), command.cronOptions);
  });
}
