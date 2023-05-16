import {ClusterManager} from 'discord-hybrid-sharding';
import * as dotenv from 'dotenv';

dotenv.config();

const totalShards = process.env.TOTAL_SHARDS ? Number(process.env.TOTAL_SHARDS) : 'auto';

const manager = new ClusterManager(`${__dirname}/bot.js`, {
  token: process.env.BOT_TOKEN,
  totalShards,
});

manager.on('clusterCreate', (cluster) => console.log(`Launched Cluster ${cluster.id}`));
manager.spawn({timeout: -1}).catch(console.error);
