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
    message: `Launched Cluster ${cluster.id} of ${manager.totalClusters - 1}`,
  });

  cluster.on('message', (message) => {
    if (typeof message !== 'object') return;
    if (!('raw' in message)) return;
    const data = message.raw as any;

    switch (data.action) {
      case 'restartAll':
        manager.recluster?.start({
          restartMode: 'gracefulSwitch',
          totalShards,
          totalClusters,
        });
        break;
      case 'restart':
        if (!data.clustersId) return;
        for (const cluster of data.clustersId) {
          const c = manager.clusters.get(cluster);
          if (!c) continue;
          c.respawn().catch((error) => {
            logger({
              clusterId: c.id,
              message: error.message,
            });
          });
        }
        break;
    }

  });
});
manager.spawn({
  timeout: -1,
}).catch((error) => {
  logger({
    message: error.message,
  });
});

manager.extend(new HeartbeatManager());

manager.extend(new ReClusterManager());
