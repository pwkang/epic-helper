import _toggleHelper from './toggle/toggle.helper';
import customMessageHelper from './custom-message/custom-message.helper';
import {_serverSettingsHelper} from './server-settings';
import {_guildSettingsHelper} from './guild-settings';

const commandHelper = {
  toggle: _toggleHelper,
  customMessage: customMessageHelper,
  serverSettings: _serverSettingsHelper,
  guildSettings: _guildSettingsHelper,
};

export default commandHelper;
