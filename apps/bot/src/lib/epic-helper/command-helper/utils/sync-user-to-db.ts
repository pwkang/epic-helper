import {userService} from '@epic-helper/services';
import ms from 'ms';
import redisUserAccount from '@epic-helper/services/dist/redis/user-account.redis';


const BATCH_SIZE = 100;

export const _syncUserToDb = async (lastUpdatedIn: string) => {
  let updated = 0;
  const updatedUsersId = new Set<string>();
  while (1) {
    const reminders = await redisUserAccount.getAllUsers(BATCH_SIZE, Array.from(updatedUsersId));
    if (!reminders.length) break;

    reminders.forEach(reminder => updatedUsersId.add(reminder.userId));

    const toUpdate = reminders.filter(reminder =>
      reminder.updatedAt &&
      reminder.updatedAt.getTime() > new Date().getTime() - ms(lastUpdatedIn),
    );

    if (!toUpdate.length) break;

    await userService.saveUsersToDb({
      users: toUpdate,
    });

    updated += toUpdate.length;
  }

  return updated;
};
