import {_isServerAdmin} from './is-server-admin';
import {_isGuildLeader} from './is-guild-leader';
import {_isGuildMember} from './is-guild-member';
import {_isDonor} from './is-donor';
import {_hasValidBoost} from './has-valid-boost';

export const userChecker = {
  isServerAdmin: _isServerAdmin,
  isGuildLeader: _isGuildLeader,
  isGuildMember: _isGuildMember,
  isDonor: _isDonor,
  hasValidBoost: _hasValidBoost,
};
