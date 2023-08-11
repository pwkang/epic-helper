import {autoAddDuelRecord} from './auto-add-duel-record';
import {_showDuelLog} from './show-duel-log';
import {manualAddDuelRecord} from './manual-add-duel-record';
import {sendDuelLog} from './send-duel-log';

export const _duelLogHelper = {
  autoAdd: autoAddDuelRecord,
  view: _showDuelLog,
  manualAdd: manualAddDuelRecord,
  sendDuelLog: sendDuelLog,
};
