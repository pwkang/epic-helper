import _getEnchantChannelsEmbed from './embed/enchant-channels.embed';
import {_getRandomEventSettingsEmbed} from './embed/random-event.embed';
import {_serverSettings} from './server-settings';

export const _serverSettingsHelper = {
  renderEnchantMuteEmbed: _getEnchantChannelsEmbed,
  renderRandomEventEmbed: _getRandomEventSettingsEmbed,
  settings: _serverSettings,
};
