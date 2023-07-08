import _toggleHelper from './toggle/toggle.helper';
import customMessageHelper from './custom-message/custom-message.helper';
import {_serverSettingsHelper} from './server-settings';
import {_guildSettingsHelper} from './guild-settings';
import {_guildHelper} from './guild';
import {_userAccountHelper} from './user-account';

const commandHelper = {
  toggle: _toggleHelper,
  customMessage: customMessageHelper,
  serverSettings: _serverSettingsHelper,
  guildSettings: _guildSettingsHelper,
  guild: _guildHelper,
  userAccount: _userAccountHelper,
};

export default commandHelper;
