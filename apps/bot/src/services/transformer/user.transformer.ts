import type {IUser} from '@epic-helper/models';
import {USER_STATS_RPG_COMMAND_TYPE} from '@epic-helper/models';
import {RPG_COMMAND_TYPE} from '@epic-helper/constants';
import {typedObjectEntries} from '@epic-helper/utils';

export const toUser = (user: any): IUser => {
  return {
    userId: user?.userId,
    channel: {
      all: user?.channel?.all,
      ...typedObjectEntries(RPG_COMMAND_TYPE).reduce((acc, [key]) => {
        acc[key] = user?.channel?.[key];
        return acc;
      }, {} as Record<keyof typeof RPG_COMMAND_TYPE, string>),
    },
    username: user?.username,
    config: {
      timezone: user?.config?.timezone,
      timeFormat: user?.config?.timeFormat,
      heal: user?.config?.heal,
      enchant: user?.config?.enchant,
      donorP: user?.config?.donorP,
      donor: user?.config?.donor,
      onOff: user?.config?.onOff,
    },
    customMessage: {
      all: user?.customMessage?.all,
      ...typedObjectEntries(RPG_COMMAND_TYPE).reduce((acc, [key]) => {
        acc[key] = user?.customMessage?.[key];
        return acc;
      }, {} as Record<keyof typeof RPG_COMMAND_TYPE, string>),
    },
    items: {
      ruby: user?.items?.ruby,
    },
    toggle: {
      dm: {
        all: user?.toggle?.dm?.all,
        ...typedObjectEntries(RPG_COMMAND_TYPE).reduce((acc, [key]) => {
          acc[key] = user?.toggle?.dm?.[key];
          return acc;
        }, {} as Record<keyof typeof RPG_COMMAND_TYPE, boolean>),
      },
      countdown: {
        all: user?.toggle?.countdown?.all,
        pet: user?.toggle?.countdown?.pet,
        reminder: user?.toggle?.countdown?.reminder,
      },
      heal: user?.toggle?.heal,
      petCatch: user?.toggle?.petCatch,
      slash: user?.toggle?.slash,
      quest: {
        all: user?.toggle?.quest?.all,
        arena: user?.toggle?.quest?.arena,
        miniboss: user?.toggle?.quest?.miniboss,
      },
      mentions: {
        all: user?.toggle?.mentions?.all,
        trainingAnswer: user?.toggle?.mentions?.trainingAnswer,
        petCatch: user?.toggle?.mentions?.petCatch,
        ...typedObjectEntries(RPG_COMMAND_TYPE).reduce((acc, [key]) => {
          acc[key] = user?.toggle?.mentions?.[key];
          return acc;
        }, {} as Record<keyof typeof RPG_COMMAND_TYPE, boolean>),
      },
      huntSwitch: user?.toggle?.huntSwitch,
      emoji: user?.toggle?.emoji,
      reminder: {
        all: user?.toggle?.reminder?.all,
        ...typedObjectEntries(RPG_COMMAND_TYPE).reduce((acc, [key]) => {
          acc[key] = user?.toggle?.reminder?.[key];
          return acc;
        }, {} as Record<keyof typeof RPG_COMMAND_TYPE, boolean>),
      },
      training: {
        all: user?.toggle?.training?.all,
        ruby: user?.toggle?.training?.ruby,
        basic: user?.toggle?.training?.basic,
      },
    },
    stats: {
      best: typedObjectEntries(USER_STATS_RPG_COMMAND_TYPE).reduce(
        (acc, [key]) => {
          acc[key] = user?.stats?.best?.[key] ?? 0;
          return acc;
        },
        {} as Record<keyof typeof USER_STATS_RPG_COMMAND_TYPE, number>,
      ),
    },
    rpgInfo: {
      maxArea: user?.rpgInfo?.maxArea,
      currentArea: user?.rpgInfo?.currentArea,
    },
  };
};

export const toUsers = (users: any[]): IUser[] => {
  return users.map(toUser);
};
