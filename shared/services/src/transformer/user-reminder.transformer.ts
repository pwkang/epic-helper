import type {IUserReminder} from '@epic-helper/models';

export const toUserReminder = (user: any): IUserReminder => {
  return {
    userId: user?.userId,
    type: user?.type,
    readyAt: user?.readyAt ? new Date(user?.readyAt) : undefined,
    props: {
      epicItemType: user?.props?.epicItemType,
      together: user?.props?.together,
      hardMode: user?.props?.hardMode,
      epicQuest: user?.props?.epicQuest,
      lootboxType: user?.props?.lootboxType,
      seedType: user?.props?.seedType,
      ultraining: user?.props?.ultraining,
      workingType: user?.props?.workingType,
    },
  };
};

export const toUserReminders = (users: any[]): IUserReminder[] =>
  users.map(toUserReminder);
