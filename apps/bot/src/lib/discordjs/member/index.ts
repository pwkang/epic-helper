import {_fetchMember} from './_fetch-member';
import {_addRoles} from './_add-role';
import {_removeRoles} from './_remove-role';
import {_fetchAllMembers} from './_fetch-all-members';
import {_clearCachedMembers} from './_clear-cached-members';

export const djsMemberHelper = {
  getMember: _fetchMember,
  addRoles: _addRoles,
  removeRoles: _removeRoles,
  fetchAll: _fetchAllMembers,
  clearCached: _clearCachedMembers,
};
