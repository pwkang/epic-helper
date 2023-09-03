import {IGuild} from '@epic-helper/models';
import {
  ActionRowBuilder,
  BaseInteraction,
  BaseMessageOptions,
  Guild,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from 'discord.js';
import {generateNavigationRow} from './pagination-row';

const GUILDS_PER_PAGE = 20;

export const GUILD_SELECTOR_NAME = 'guild-selector';

interface IGetGuildSelectorComponents {
  guilds: IGuild[];
  currentGuildRoleId: string;
  server: Guild;
}

export const guildSelectorHelper = ({
  guilds,
  currentGuildRoleId,
  server,
}: IGetGuildSelectorComponents) => {
  const totalGuilds = guilds.length;
  let page = 0;
  let guildId = currentGuildRoleId;

  const getSelector = () => {
    const components: BaseMessageOptions['components'] = [];
    const selector = _getPageSelector({
      guilds,
      page,
      server,
      selectedGuildRoleId: guildId,
    });

    const paginator = generateNavigationRow({
      page,
      itemsPerPage: GUILDS_PER_PAGE,
      total: totalGuilds,
    });

    if (guilds.length > 1) components.push(selector);

    if (guilds.length > GUILDS_PER_PAGE) components.push(paginator);

    return components;
  };

  const readInteraction = ({
    interaction,
  }: {
    interaction: BaseInteraction | StringSelectMenuInteraction;
  }) => {
    if (interaction.isStringSelectMenu() && interaction.customId === GUILD_SELECTOR_NAME) {
      guildId = interaction.values[0];
    }
    if (interaction.isButton()) {
      page = Number(interaction.customId);
    }
  };

  return {
    getGuildId: () => guildId,
    getSelector,
    readInteraction,
  };
};

interface IGetPageSelector {
  server: Guild;
  guilds: IGuild[];
  page: number;
  selectedGuildRoleId?: string;
}

const _getPageSelector = ({page, guilds, selectedGuildRoleId, server}: IGetPageSelector) => {
  const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>();
  const menu = new StringSelectMenuBuilder()
    .setCustomId(GUILD_SELECTOR_NAME)
    .setPlaceholder('Select a guild');
  const start = page * GUILDS_PER_PAGE;
  const end = start + GUILDS_PER_PAGE;
  const guildsOnPage = guilds.slice(start, end);
  guildsOnPage.forEach((guild) => {
    const roleName = server.roles.cache.get(guild.roleId)?.name;
    menu.addOptions({
      label: guild.info.name ? guild.info.name : `Role: ${roleName ?? 'Not found'}`,
      description: guild.info.name ? `Role: ${roleName ?? 'Not found'}` : undefined,
      value: guild.roleId,
      default: guild.roleId === selectedGuildRoleId,
    });
  });
  actionRow.addComponents(menu);
  return actionRow;
};
