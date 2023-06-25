import {BaseMessageOptions, EmbedBuilder, Guild} from 'discord.js';
import {_getGuildSettingsEmbed} from './embed/guild-settings.embed';
import {_getPageSelector} from './page-selector';
import {IGuild} from '@epic-helper/models';
import {generateNavigationRow} from '../../../../utils/pagination-row';

export interface IGetMessagePayload {
  server: Guild;
  guilds: IGuild[];
  guildRoleId?: string;
  page?: number;
}

export const ITEMS_PER_PAGE = 25;

export const _getMessagePayload = async ({
  server,
  guildRoleId,
  guilds,
  page = 0,
}: IGetMessagePayload): Promise<BaseMessageOptions> => {
  if (!guilds.length)
    return {
      content: 'There is no guild setup in this server',
    };

  let embed: EmbedBuilder = _getGuildSettingsEmbed({
    guildAccount: guildRoleId ? guilds.find((guild) => guild.roleId === guildRoleId)! : guilds[0],
  });

  const guildSelector = _getPageSelector({
    guilds,
    page,
    server,
    limit: ITEMS_PER_PAGE,
    selectedGuildRoleId: guildRoleId ?? guilds[0].roleId,
  });

  const paginator = generateNavigationRow({
    page,
    itemsPerPage: ITEMS_PER_PAGE,
    total: Math.ceil(guilds.length / ITEMS_PER_PAGE) - 1,
  });

  const components: BaseMessageOptions['components'] = [];

  if (guilds.length > 1) {
    components.push(guildSelector);
  }

  if (guilds.length > ITEMS_PER_PAGE) {
    components.push(paginator);
  }

  return {
    embeds: [embed],
    components,
  };
};
