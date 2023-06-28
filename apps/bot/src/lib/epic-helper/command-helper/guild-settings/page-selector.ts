import {IGuild} from '@epic-helper/models';
import {ActionRowBuilder, Guild, StringSelectMenuBuilder} from 'discord.js';

interface IGetPageSelector {
  server: Guild;
  guilds: IGuild[];
  page: number;
  limit: number;
  selectedGuildRoleId?: string;
}

export const GUILD_SELECTOR_NAME = 'guild-selector';

export const _getPageSelector = ({
  page,
  guilds,
  limit,
  selectedGuildRoleId,
  server,
}: IGetPageSelector) => {
  const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>();
  const menu = new StringSelectMenuBuilder()
    .setCustomId(GUILD_SELECTOR_NAME)
    .setPlaceholder('Select a guild');
  const start = page * limit;
  const end = start + limit;
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
