import type {Client} from 'discord.js';
import {schedule} from 'node-cron';
import {handlerFileFilter, handlerRoot} from './constant';
import {importFiles, logger} from '@epic-helper/utils';

export default async function loadCronJob(client: Client) {
  const commands = await importFiles<CronJob>({
    path: `./${handlerRoot}/cron`,
    options: {
      fileFilter: [handlerFileFilter],
    },
  });
  logger({
    message: `Loaded (${commands.length}) cron jobs`,
    clusterId: client.cluster?.id,
  });
  commands.forEach(({data}) => {
    if (!data?.name || data.disabled) return;
    schedule(data.expression, () => data.execute(client), {
      ...data.cronOptions,
      timezone: 'Asia/Kuala_Lumpur',
    });
  });
}
