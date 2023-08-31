import {_isServerAdmin} from './is-server-admin';
import {_isGuildLeader} from './is-guild-leader';

export const userChecker = {
  isServerAdmin: _isServerAdmin,
  isGuildLeader: _isGuildLeader,
};
