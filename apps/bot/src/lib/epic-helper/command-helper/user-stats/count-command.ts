import type {USER_STATS_RPG_COMMAND_TYPE} from '@epic-helper/models';
import {userService, userStatsService} from '@epic-helper/services';
import type {ValuesOf} from '@epic-helper/types';

interface ICountCommand {
  userId: string;
  type: ValuesOf<typeof USER_STATS_RPG_COMMAND_TYPE>;
}

export const _countCommand = async ({userId, type}: ICountCommand) => {
  const updatedStats = await userStatsService.countUserStats({
    userId,
    type,
  });

  const bestStats = await userService.getBestStats({
    userId,
  });

  const currentStats = updatedStats?.rpg[type] ?? 0;
  const currentBestStats = bestStats?.[type] ?? 0;

  if (currentStats > currentBestStats) {
    await userService.updateBestStats({
      userId,
      type,
      value: updatedStats?.rpg[type],
    });
  }
};
