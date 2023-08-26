import {BaseMessageOptions, EmbedBuilder, Guild} from 'discord.js';
import {guildDuelService} from '../../../../services/database/guild-duel.service';
import {guildService} from '../../../../services/database/guild.service';
import {IGuildDuel} from '@epic-helper/models/dist/guild-duel/guild-duel.type';
import {BOT_COLOR} from '@epic-helper/constants';
import {IGuild} from '@epic-helper/models';
import {getGuildWeek} from '@epic-helper/utils';
import ms from 'ms';
import messageFormatter from '../../../discordjs/message-formatter';

interface IShowDuelLog {
  server: Guild;
}

export const _showDuelLog = async ({server}: IShowDuelLog) => {
  const duelLogs = await guildDuelService.getLastTwoWeeksGuildsDuelLogs({
    serverId: server.id,
  });
  const guilds = await guildService.getAllGuilds({
    serverId: server.id,
  });
  const currentGuild = guilds[0];

  const render = (): BaseMessageOptions => {
    if (!currentGuild)
      return {
        content: 'No guilds found',
      };

    return {
      embeds: [generateEmbed({duelLogs, guild: currentGuild})],
    };
  };

  return {
    render,
  };
};

interface IGenerateEmbed {
  guild: IGuild;
  duelLogs: IGuildDuel[];
}

const generateEmbed = ({duelLogs, guild}: IGenerateEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: guild.info.name + ' - Duel List',
  });
  const currentCycle = {
    label: 'Current Cycle',
    logs: duelLogs.find((log) => log.weekAt.getTime() === getGuildWeek().getTime()),
  };
  const previousCycle = {
    label: 'Previous Cycle',
    logs: duelLogs.find((log) => log.weekAt.getTime() == getGuildWeek().getTime() - ms('7d')),
  };
  [currentCycle, previousCycle].forEach((cycle) => {
    embed.addFields({
      name: cycle.label,
      value: cycle.logs
        ? cycle.logs.users
          .sort((a, b) => b.totalExp - a.totalExp)
          .map(
            (user, index) =>
              `\`[${index + 1}]\` ${messageFormatter.user(user.userId)} \`${user.totalExp} XP | ${
                user.duelCount
              } duels\``
          )
          .join('\n')
        : 'None',
      inline: true,
    });
  });

  return embed;
};
