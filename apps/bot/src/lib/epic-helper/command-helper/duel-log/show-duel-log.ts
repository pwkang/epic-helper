import {
  BaseInteraction,
  BaseMessageOptions,
  EmbedBuilder,
  Guild,
  StringSelectMenuInteraction,
} from 'discord.js';
import {guildDuelService} from '../../../../services/database/guild-duel.service';
import {guildService} from '../../../../services/database/guild.service';
import {IGuildDuel} from '@epic-helper/models/dist/guild-duel/guild-duel.type';
import {BOT_COLOR} from '@epic-helper/constants';
import {IGuild} from '@epic-helper/models';
import {getGuildWeek} from '@epic-helper/utils';
import ms from 'ms';
import messageFormatter from '../../../discordjs/message-formatter';
import {guildSelectorHelper} from '../../../../utils/guild-selector';

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
  const guildSelector = guildSelectorHelper({
    guilds,
    server,
    currentGuildRoleId: guilds[0]?.roleId,
  });

  const render = (): BaseMessageOptions => {
    const guild = guilds.find((guild) => guild.roleId === guildSelector.getGuildId());
    if (!guild)
      return {
        content: 'No guilds found',
      };

    return {
      embeds: [generateEmbed({duelLogs, guild})],
      components: guildSelector.getSelector(),
    };
  };

  const replyInteraction = ({interaction}: IReplyInteraction): BaseMessageOptions => {
    guildSelector.readInteraction({
      interaction,
    });
    const guild = guilds.find((guild) => guild.roleId === guildSelector.getGuildId());
    if (!guild)
      return {
        content: 'No guilds found',
      };

    return {
      embeds: [generateEmbed({duelLogs, guild})],
      components: guildSelector.getSelector(),
    };
  };

  return {
    render,
    replyInteraction,
  };
};

interface IGenerateEmbed {
  guild: IGuild;
  duelLogs: IGuildDuel[];
}

const generateEmbed = ({duelLogs, guild}: IGenerateEmbed) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed).setAuthor({
    name: guild.info.name ? `${guild.info.name} - Duel List` : 'Duel List',
  });
  const currentCycle = {
    label: 'Current Cycle',
    logs: duelLogs.find(
      (log) => log.guildRoleId === guild.roleId && log.weekAt.getTime() === getGuildWeek().getTime()
    ),
  };
  const previousCycle = {
    label: 'Previous Cycle',
    logs: duelLogs.find(
      (log) =>
        log.guildRoleId === guild.roleId &&
        log.weekAt.getTime() == getGuildWeek().getTime() - ms('7d')
    ),
  };
  [currentCycle, previousCycle].forEach((cycle) => {
    embed.addFields({
      name: cycle.label,
      value: cycle.logs?.users?.length
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

interface IReplyInteraction {
  interaction: BaseInteraction | StringSelectMenuInteraction;
}
