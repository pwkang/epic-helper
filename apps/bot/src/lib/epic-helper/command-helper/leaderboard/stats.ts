import type {Client} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {getStartOfYesterday} from '@epic-helper/utils';
import {USER_STATS_RPG_COMMAND_TYPE} from '@epic-helper/models';
import {BOT_COLOR} from '@epic-helper/constants';
import {userService, userStatsService} from '@epic-helper/services';
import {djsMessageHelper} from '../../../discordjs/message';

interface IStatsLeaderboard {
  client: Client;
  channelId: string;
}

const statsType = [
  {
    type: USER_STATS_RPG_COMMAND_TYPE.hunt,
    label: '🔹 HUNT 🔹',
  },
  {
    type: USER_STATS_RPG_COMMAND_TYPE.huntTogether,
    label: '🔹 HUNT TOGETHER 🔹',
  },
  {
    type: USER_STATS_RPG_COMMAND_TYPE.adventure,
    label: '🔹 ADVENTURE 🔹',
  },
  {
    type: USER_STATS_RPG_COMMAND_TYPE.working,
    label: '🔹 WORKING 🔹',
  },
  {
    type: USER_STATS_RPG_COMMAND_TYPE.farm,
    label: '🔹 FARM 🔹',
  },
] as const;

export const _statsLeaderboard = async ({
  channelId,
  client,
}: IStatsLeaderboard) => {
  const yesterday = getStartOfYesterday();
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setTitle('Global Statistic leaderboard')
    .setFooter({
      text: 'Last updated',
    })
    .setTimestamp(new Date());

  for (const {type, label} of statsType) {
    const stats = await userStatsService.getBestStats({
      type,
      day: yesterday,
      limit: 3,
    });
    const value = [];

    for (const stat of stats) {
      const user = await userService.getUserAccount(stat.userId);
      value.push(
        `\`[${value.length + 1}]\` **${user?.username}** | ${stat.rpg[type]}`,
      );
    }
    if (!value.length) value.push('No data');
    embed.addFields({
      name: label,
      value: value.join('\n'),
    });
  }

  const channel = client.channels.cache.get(channelId);
  if (!channel) return;
  await djsMessageHelper.send({
    client,
    options: {
      embeds: [embed],
    },
    channelId,
  });
};
