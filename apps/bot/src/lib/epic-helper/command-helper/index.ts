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
import {_botInfoHelper} from './bot-info';
import {_duelLogHelper} from './duel-log';
import {_petHelper} from './pet';
import {_userStatsHelper} from './user-stats';
import {_leaderboardHelper} from './leaderboard';
import {_clusterHelper} from './cluster';
import {_redisHelper} from './redis';
import {_utilsHelper} from './utils';
import {_groupCooldownsHelper} from './group-cooldowns';

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
  information: _botInfoHelper,
  duel: _duelLogHelper,
  pet: _petHelper,
  userStats: _userStatsHelper,
  leaderboard: _leaderboardHelper,
  cluster: _clusterHelper,
  redis: _redisHelper,
  utils: _utilsHelper,
  groupCooldowns: _groupCooldownsHelper,
};

export default commandHelper;
