import {ClusterManager, HeartbeatManager, ReClusterManager} from 'discord-hybrid-sharding';
import * as dotenv from 'dotenv';
import {logger} from '@epic-helper/utils';

dotenv.config();

const totalClusters = process.env.TOTAL_CLUSTERS
  ? Number(process.env.TOTAL_CLUSTERS)
  : 1;
const totalShards = process.env.TOTAL_SHARDS
  ? Number(process.env.TOTAL_SHARDS)
  : 'auto';

const manager = new ClusterManager(`${__dirname}/bot.js`, {
  token: process.env.BOT_TOKEN,
  totalClusters,
  totalShards,
});

manager.on('clusterCreate', (cluster) => {
  logger({
    message: `Launched Cluster ${cluster.id}`,
  });

  cluster.on('message', (message) => {
    if (typeof message !== 'object') return;
    if (!('raw' in message)) return;
    if (!('action' in message.raw)) return;

    switch (message.raw.action) {
      case 'restartAll':
        manager.recluster?.start({
          restartMode: 'rolling',
          totalShards,
          totalClusters,
        });
        break;
      case 'restart':
        cluster.respawn({});
        break;
    }

  });
});
manager.spawn({timeout: -1}).catch((error) => {
  logger({
    message: error.message,
  });
});

manager.extend(new HeartbeatManager());

manager.extend(new ReClusterManager());
