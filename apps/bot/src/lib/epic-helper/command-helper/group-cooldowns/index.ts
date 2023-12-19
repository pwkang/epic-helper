import {_viewGroupCooldowns} from './view-group-cooldowns';
import {_setGroupCooldowns} from './set-group-cooldowns';
import {_resetGroupCooldowns} from './reset-group-cooldowns';
import {_removeGroupCooldownsUsers} from './remove-group-cooldowns';

export const _groupCooldownsHelper = {
  viewGroupCooldowns: _viewGroupCooldowns,
  setGroupCooldowns: _setGroupCooldowns,
  resetGroupCooldowns: _resetGroupCooldowns,
  removeGroupCooldownsUsers: _removeGroupCooldownsUsers,
};
