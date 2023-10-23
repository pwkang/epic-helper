import {autoAddDuelRecord} from './auto-add-duel-record';
import {_showDuelLog} from './show-duel-log';
import {manualAddDuelRecord} from './manual-add-duel-record';
import {sendDuelLog} from './send-duel-log';
import {modifyDuelRecord} from './modify-duel-record';
import {_resetDuelRecord} from './reset-duel-record';
import {_undoDuelRecord} from './undo-duel-record';

export const _duelLogHelper = {
  undo: _undoDuelRecord,
  autoAdd: autoAddDuelRecord,
  view: _showDuelLog,
  manualAdd: manualAddDuelRecord,
  sendDuelLog: sendDuelLog,
  modifyLog: modifyDuelRecord,
  reset: _resetDuelRecord,
};
