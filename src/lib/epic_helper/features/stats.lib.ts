import {
  getUserBestStats,
  getUserStatsOfLast2Weeks,
} from '../../../models/user-stats/user-stats.service';
import {EmbedBuilder, EmbedField, User} from 'discord.js';
import {BOT_COLOR} from '../../../constants/bot';
import {
  getDayOfWeek,
  getStartOfLastWeek,
  getStartOfThisWeek,
  getStartOfToday,
  getStartOfYesterday,
} from '../../../utils/datetime';
import {IUserStats, USER_STATS_RPG_COMMAND_TYPE} from '../../../models/user-stats/user-stats.types';

interface IGetDonorStatsEmbed {
  author: User;
}

export const getStatsEmbeds = async ({author}: IGetDonorStatsEmbed) => {
  const stats = await getUserStatsOfLast2Weeks({userId: author.id});
  const bestStats = await getUserBestStats({
    userId: author.id,
  });

  return {
    nonDonor: getNonDonorStatsEmbed({stats, author}),
    donor: getDonorDefaultEmbed({stats, author, bestStats}),
    thisWeek: getThisWeekStats({stats, author}),
    lastWeek: getLastWeekStats({stats, author}),
  };
};

const weekDays = {
  0: 'Monday',
  1: 'Tuesday',
  2: 'Wednesday',
  3: 'Thursday',
  4: 'Friday',
  5: 'Saturday',
  6: 'Sunday',
};

interface IGetThisWeekStats {
  stats: IUserStats[];
  author: User;
}

const getThisWeekStats = ({stats, author}: IGetThisWeekStats) => {
  const startOfWeek = getStartOfThisWeek();
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setAuthor({
      name: `${author.username}'s this week stats`,
      iconURL: author.avatarURL() ?? undefined,
    })
    .setThumbnail(author.avatarURL());
  for (let [key, value] of Object.entries(weekDays)) {
    const dayStats = stats.find((stat) => stat.statsAt.getTime() === startOfWeek.getTime());
    embed.addFields(generateStatsField(value, dayStats?.rpg));
    startOfWeek.setDate(startOfWeek.getDate() + 1);
  }
  return embed;
};

interface IGetLastWeekStats {
  stats: IUserStats[];
  author: User;
}

const getLastWeekStats = ({stats, author}: IGetLastWeekStats) => {
  const startOfWeek = getStartOfLastWeek();
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setAuthor({
      name: `${author.username}'s last week stats`,
      iconURL: author.avatarURL() ?? undefined,
    })
    .setThumbnail(author.avatarURL());
  for (let [key, value] of Object.entries(weekDays)) {
    const dayStats = stats.find((stat) => stat.statsAt.getTime() === startOfWeek.getTime());
    embed.addFields(generateStatsField(value, dayStats?.rpg));
    startOfWeek.setDate(startOfWeek.getDate() + 1);
  }
  return embed;
};

interface getDonorDefaultEmbed {
  stats: IUserStats[];
  author: User;
  bestStats?: IUserStats['rpg'];
}

const getDonorDefaultEmbed = ({stats, author, bestStats}: getDonorDefaultEmbed) => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setAuthor({
      name: `${author.username}'s stats`,
      iconURL: author.avatarURL() ?? undefined,
    })
    .setThumbnail(author.avatarURL());

  const todayStats = stats.find((stat) => stat.statsAt.getTime() === getStartOfToday().getTime());
  const yesterdayStats = stats.find(
    (stat) => stat.statsAt.getTime() === getStartOfYesterday().getTime()
  );
  const thisWeekAvg = stats
    .filter((stat) => stat.statsAt.getTime() > getStartOfThisWeek().getTime())
    .map((stat) => stat.rpg);
  const lastWeekAvg = stats
    .filter((stat) => stat.statsAt.getTime() < getStartOfThisWeek().getTime())
    .map((stat) => stat.rpg);
  embed.addFields(
    generateStatsField('Today', todayStats?.rpg),
    generateStatsField('Yesterday', yesterdayStats?.rpg),
    generateStatsField('Best', bestStats),
    generateWeeklyStatsField('This week', getDayOfWeek(), calculateTotal(thisWeekAvg)),
    generateWeeklyStatsField('Last week', 7, calculateTotal(lastWeekAvg))
  );

  return embed;
};

interface IGetNonDonorStatsEmbed {
  stats: IUserStats[];
  author: User;
  bestStats?: IUserStats['rpg'];
}

const getNonDonorStatsEmbed = ({stats, author, bestStats}: IGetNonDonorStatsEmbed) => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setAuthor({
      name: `${author.username}'s stats`,
      iconURL: author.avatarURL() ?? undefined,
    })
    .setThumbnail(author.avatarURL())
    .setFooter({
      text: 'If you want to view real time stats, you can donate to the bot and get access some extra benefits',
    });

  const yesterdayStats = stats.find(
    (stat) => stat.statsAt.getTime() === getStartOfYesterday().getTime()
  );
  const lastWeekAvg = stats
    .filter((stat) => stat.statsAt.getTime() < getStartOfThisWeek().getTime())
    .map((stat) => stat.rpg);

  embed.addFields(
    generateStatsField('Yesterday', yesterdayStats?.rpg),
    generateWeeklyStatsField('Last week', 7, calculateTotal(lastWeekAvg)),
    generateStatsField('Best', bestStats)
  );
  return embed;
};

const statsToShow = {
  [USER_STATS_RPG_COMMAND_TYPE.hunt]: 'Hunt',
  [USER_STATS_RPG_COMMAND_TYPE.huntTogether]: 'Hunt T',
  [USER_STATS_RPG_COMMAND_TYPE.adventure]: 'Adventure',
  [USER_STATS_RPG_COMMAND_TYPE.training]: 'Training',
  [USER_STATS_RPG_COMMAND_TYPE.ultraining]: 'Ultraining',
  [USER_STATS_RPG_COMMAND_TYPE.working]: 'Working',
  [USER_STATS_RPG_COMMAND_TYPE.farm]: 'Farm',
} as const;

const generateStatsField = (name: string, stats?: Partial<IUserStats['rpg']>): EmbedField => {
  const row: string[] = [];

  for (let [type, label] of Object.entries(statsToShow) as [keyof typeof statsToShow, string][]) {
    if (
      [USER_STATS_RPG_COMMAND_TYPE.huntTogether, USER_STATS_RPG_COMMAND_TYPE.ultraining].some(
        (_type) => type === _type
      ) &&
      !stats?.[type]
    )
      continue;
    row.push(`🔸 **${label}**: ${stats?.[type] ?? 0}`);
  }

  return {
    name,
    value: row.join('\n'),
    inline: true,
  };
};

const generateWeeklyStatsField = (
  name: string,
  divideBy: number,
  stats?: Partial<IUserStats['rpg']>
): EmbedField => {
  const row: string[] = [];

  for (let [type, label] of Object.entries(statsToShow) as [keyof typeof statsToShow, string][]) {
    if (
      [USER_STATS_RPG_COMMAND_TYPE.huntTogether, USER_STATS_RPG_COMMAND_TYPE.ultraining].some(
        (_type) => type === _type
      ) &&
      !stats?.[type]
    )
      continue;
    const amount = stats?.[type] ?? 0;
    const avg = Math.round(amount / divideBy);
    row.push(`🔸 **${label}**: ${amount} | avg: ${avg}`);
  }

  return {
    name,
    value: row.join('\n'),
    inline: true,
  };
};

const calculateTotal = (stats: IUserStats['rpg'][]): Partial<IUserStats['rpg']> => {
  const avg: Partial<IUserStats['rpg']> = {};

  for (let [type, label] of Object.entries(statsToShow) as [keyof typeof statsToShow, string][]) {
    avg[type] = stats.reduce((acc, stat) => acc + (stat?.[type] ?? 0), 0);
  }

  return avg;
};
