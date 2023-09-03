import {serverService} from '../../../../services/database/server.service';
import {
  ActionRowBuilder,
  BaseInteraction,
  BaseMessageOptions,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from 'discord.js';
import {generateNavigationRow} from '../../../../utils/pagination-row';
import {BOT_COLOR} from '@epic-helper/constants';

const SERVERS_PER_PAGE = 1;

interface IRemoveEpicTokens {
  userId: string;
}

export const _removeEpicTokens = async ({userId}: IRemoveEpicTokens) => {
  const boostedServers = await serverService.getUserBoostedServers({
    userId,
  });
  let page = 0;

  const render = (): BaseMessageOptions => {
    return {
      embeds: [getSelectServerEmbed({boostedServers})],
      components: getInteraction({
        boostedServers,
        page,
      }),
    };
  };

  const responseInteraction = async (
    interaction: BaseInteraction
  ): Promise<BaseMessageOptions | null> => {
    if (interaction.isStringSelectMenu() && interaction.customId === 'server') {
      const serverId = interaction.values[0];
      const removedServer = boostedServers.find((server) => server.serverId === serverId);
      await removeTokens({
        serverId,
        userId,
      });
      return {
        embeds: [getSuccessEmbed({serverName: removedServer?.name})],
        components: [],
      };
    }
    if (interaction.isButton()) {
      page = Number(interaction.customId);
      return render();
    }
    return null;
  };

  return {
    render,
    responseInteraction,
  };
};

interface IRemoveTokens {
  serverId: string;
  userId: string;
}

const removeTokens = async ({serverId, userId}: IRemoveTokens) => {
  await serverService.removeTokens({
    serverId,
    userId,
  });
};

interface IGetInteraction {
  page: number;
  boostedServers: Awaited<ReturnType<typeof serverService.getUserBoostedServers>>;
}

const getInteraction = ({boostedServers, page}: IGetInteraction) => {
  const actionRows = [];
  if (!boostedServers.length) {
    return [];
  }
  actionRows.push(
    getServerSelector({
      page,
      servers: boostedServers,
    })
  );
  if (boostedServers.length > SERVERS_PER_PAGE) {
    actionRows.push(
      generateNavigationRow({
        page,
        total: boostedServers.length,
        all: false,
        itemsPerPage: SERVERS_PER_PAGE,
      })
    );
  }
  return actionRows;
};

interface IGetServerSelector {
  page: number;
  servers: Awaited<ReturnType<typeof serverService.getUserBoostedServers>>;
}

const getServerSelector = ({servers, page}: IGetServerSelector) => {
  const serversToShow = servers.slice(page * SERVERS_PER_PAGE, (page + 1) * SERVERS_PER_PAGE);
  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('server')
      .setPlaceholder('Select a server')
      .addOptions(
        serversToShow.map((server) => ({
          value: server.serverId,
          label: server.name,
          description: `Token: ${server.token}`,
        }))
      )
  );
};

interface IGetSelectServerEmbed {
  boostedServers: Awaited<ReturnType<typeof serverService.getUserBoostedServers>>;
}

const getSelectServerEmbed = ({boostedServers}: IGetSelectServerEmbed) => {
  if (!boostedServers.length) {
    return new EmbedBuilder()
      .setDescription('You have not boost any server yet')
      .setColor(BOT_COLOR.embed);
  }
  return new EmbedBuilder()
    .setTitle('Select a server to remove tokens from.')
    .setColor(BOT_COLOR.embed)
    .setDescription('This will remove all tokens from the selected server immediately.');
};

interface IGetSuccessEmbed {
  serverName?: string;
}

const getSuccessEmbed = ({serverName}: IGetSuccessEmbed) => {
  return new EmbedBuilder()
    .setDescription(`Successfully removed tokens${serverName ? ` from **${serverName}**` : ''}.`)
    .setColor(BOT_COLOR.embed);
};
