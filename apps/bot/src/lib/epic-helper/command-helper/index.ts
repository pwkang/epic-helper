import {_toggleHelper} from './toggle/toggle.helper';
import {_customMessageHelper} from './custom-message/_custom-message.helper';
import {_serverSettingsHelper} from './server-settings';
import {_guildSettingsHelper} from './guild-settings';
import {_guildHelper} from './guild';
import {_userAccountHelper} from './user-account';
import {_serverHelper} from './server';
import {_donorHelper} from './donor';
import {_freeDonorHelper} from './free-donor';
import {_epicTokenHelper} from './epic-token';

const commandHelper = {
  toggle: _toggleHelper,
  customMessage: _customMessageHelper,
  serverSettings: _serverSettingsHelper,
  server: _serverHelper,
  guildSettings: _guildSettingsHelper,
  guild: _guildHelper,
  userAccount: _userAccountHelper,
  donor: _donorHelper,
  freeDonor: _freeDonorHelper,
  epicToken: _epicTokenHelper,
};

export default commandHelper;
