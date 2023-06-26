import {_getMessagePayload, ITEMS_PER_PAGE} from './message-payload';
import {_getGuildSettingsEmbed} from './embed/guild-settings.embed';
import {GUILD_SELECTOR_NAME} from './page-selector';

export const _guildSettingsHelper = {
  getMessagePayload: _getMessagePayload,
  renderGuildSettingsEmbed: _getGuildSettingsEmbed,
  ITEMS_PER_PAGE,
  GUILD_SELECTOR_NAME,
};
