import _toggleHelper from './toggle/toggle.helper';
import customMessageHelper from './custom-message/custom-message.helper';
import {_serverSettingsHelper} from './server-settings';
import {_guildSettingsHelper} from './guild-settings';
import {_guildHelper} from './guild';
import {_userAccountHelper} from './user-account';
import {_serverHelper} from './server';
import {_donorHelper} from './donor';
import {_freeDonorHelper} from './free-donor';

const commandHelper = {
  toggle: _toggleHelper,
  customMessage: customMessageHelper,
  serverSettings: _serverSettingsHelper,
  server: _serverHelper,
  guildSettings: _guildSettingsHelper,
  guild: _guildHelper,
  userAccount: _userAccountHelper,
  donor: _donorHelper,
  freeDonor: _freeDonorHelper,
};

export default commandHelper;
