import {_isClusterActive} from './is-cluster-active';
import {_setClusterInfo} from './set-cluster-info';
import {_restartAll} from './restart-all';
import {_restartClusters} from './_restart-clusters';

export const _clusterHelper = {
  isClusterActive: _isClusterActive,
  setClusterInfo: _setClusterInfo,
  restartAll: _restartAll,
  restartClusters: _restartClusters,
};
