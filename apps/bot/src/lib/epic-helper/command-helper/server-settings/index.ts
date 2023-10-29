import {_serverSettings} from './server-settings';
import {_ttVerificationSettings} from './server-tt-verification';
import {_serverAdmin} from './server-admin';
import {_serverAdminRole} from './server-admin-role';
import {_enchantMuteSettings} from './enchant-mute';

export const _serverSettingsHelper = {
  settings: _serverSettings,
  ttVerification: _ttVerificationSettings,
  admin: _serverAdmin,
  adminRole: _serverAdminRole,
  enchantMute: _enchantMuteSettings,
};
