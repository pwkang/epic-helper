import {_useEpicToken} from './use-epic-token';
import {_removeEpicTokens} from './remove-epic-tokens';
import {_syncBoostedServers} from './refresh-epic-tokens';

export const _epicTokenHelper = {
  useEpicToken: _useEpicToken,
  removeEpicToken: _removeEpicTokens,
  syncBoostedServers: _syncBoostedServers
};
