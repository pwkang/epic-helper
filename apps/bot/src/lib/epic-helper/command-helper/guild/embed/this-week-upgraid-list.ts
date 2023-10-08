import type {IGuild, IUpgraid} from '@epic-helper/models';
import {EmbedBuilder} from 'discord.js';
import {BOT_COLOR} from '@epic-helper/constants';
import messageFormatter from '../../../../discordjs/message-formatter';
import {getGuildWeek} from '@epic-helper/utils';
import ms from 'ms';
import convertMsToHumanReadableString from '../../../../../utils/convert-ms-to-human-readable-string';

interface IRenderThisWeekUpgraidListEmbed {
  guild: IGuild;
  upgraidList: IUpgraid;
}

export const _renderThisWeekUpgraidListEmbed = ({
  upgraidList,
  guild
}: IRenderThisWeekUpgraidListEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed);
  const guildName = guild.info.name ?? '';
  embed.setTitle(`${guildName} Upgrade / Raid List`);
  const users = upgraidList.users
    .sort((a, b) => b.records.length - a.records.length)
    .slice(0, 10);
  embed.addFields({
    name: 'Records',
    value: users.length
      ? users
        .map(
          (user, index) =>
            `\`[${index + 1}]\` ${messageFormatter.user(user.uId)}: **${
              user.records.length
            } times**`
        )
        .join('\n')
      : 'No records',
    inline: true
  });

  const guildMessage =
    guild.upgraid.readyAt &&
    new Date().getTime() < guild.upgraid.readyAt.getTime()
      ? `Reminds in ${convertMsToHumanReadableString(
        guild.upgraid.readyAt.getTime() - new Date().getTime()
      )}`
      : 'Ready';
  embed.setFooter({
    text: `${calcRemainingCount()} left | ${guildMessage}`
  });
  return embed;
};

const calcRemainingCount = () => {
  const startOfWeek = getGuildWeek();
  const endOfWeek = new Date(startOfWeek.getTime() + ms('7d'));
  const now = new Date();
  const remaining = endOfWeek.getTime() - now.getTime();
  return Math.floor(remaining / ms('2h'));
};
