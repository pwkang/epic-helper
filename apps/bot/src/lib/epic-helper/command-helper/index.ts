import _toggleHelper from './toggle/toggle.helper';
import customMessageHelper from './custom-message/custom-message.helper';
import {_serverSettingsHelper} from './server-settings';

const commandHelper = {
  toggle: _toggleHelper,
  customMessage: customMessageHelper,
  serverSettings: _serverSettingsHelper,
};

export default commandHelper;
