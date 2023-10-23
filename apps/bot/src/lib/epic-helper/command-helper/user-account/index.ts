import {_registerAccount} from './register-account';
import {_turnOnAccount} from './account-on';
import {_turnOffAccount} from './account-off';
import {_setDonor} from './set-donor';
import {_setDonorP} from './set-donor-partner';
import {_deleteAccount} from './account-delete';
import {_setEnchant} from './account-enchant';
import {_accountSettings} from './account-settings';

export const _userAccountHelper = {
  register: _registerAccount,
  turnOnAccount: _turnOnAccount,
  turnOffAccount: _turnOffAccount,
  setDonor: _setDonor,
  setDonorP: _setDonorP,
  deleteAccount: _deleteAccount,
  setEnchant: _setEnchant,
  settings: _accountSettings,
};
