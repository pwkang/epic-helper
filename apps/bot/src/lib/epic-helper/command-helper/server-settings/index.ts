import {_getMessagePayload} from './message-payload';
import {SERVER_SETTINGS_SELECT_MENU_ID} from './constant';
import _getEnchantChannelsEmbed from './embed/enchant-channels.embed';
import {_getRandomEventSettingsEmbed} from './embed/random-event.embed';

export const _serverSettingsHelper = {
  getMessagePayload: _getMessagePayload,
  renderEnchantMuteEmbed: _getEnchantChannelsEmbed,
  renderRandomEventEmbed: _getRandomEventSettingsEmbed,
  SERVER_SETTINGS_SELECT_MENU_ID,
};
