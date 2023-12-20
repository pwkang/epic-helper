import commandHelper from '../lib/epic-helper/command-helper';

export default <CronJob>{
  name: 'save-user-info',
  expression: '0 0 * * *',
  clusterId: 0,
  cronOptions: {},
  execute: async () => {
    await commandHelper.utils.syncUserToDb('10m');
  },
};
