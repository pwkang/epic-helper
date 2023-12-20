import commandHelper from '../lib/epic-helper/command-helper';

export default <CronJob>{
  name: 'save-reminder-info',
  expression: '0 6 * * *',
  clusterId: 0,
  cronOptions: {},
  execute: async () => {
    await commandHelper.utils.syncReminderToDb();
  },
};
