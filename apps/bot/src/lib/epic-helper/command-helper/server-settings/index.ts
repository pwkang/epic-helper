import {_getMessagePayload} from './message-payload';
import {SERVER_SETTINGS_SELECT_MENU_ID} from './constant';
import getEnchantChannelsEmbed from './embed/enchant-channels.embed';

export const _serverSettingsHelper = {
  getMessagePayload: _getMessagePayload,
  renderEnchantMuteEmbed: getEnchantChannelsEmbed,
  SERVER_SETTINGS_SELECT_MENU_ID,
};
