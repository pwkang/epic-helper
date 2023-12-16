import {_syncUserReminderToDb} from './sync-user-reminder-to-db';
import {_syncUserToDb} from './sync-user-to-db';

export const _utilsHelper = {
  syncReminderToDb: _syncUserReminderToDb,
  syncUserToDb: _syncUserToDb,
};
