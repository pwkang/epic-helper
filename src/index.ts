import {ClusterManager} from 'discord-hybrid-sharding'
import * as dotenv from 'dotenv';

dotenv.config();

const manager = new ClusterManager(`${__dirname}/bot.js`, {
    token: process.env.BOT_TOKEN,
    totalShards: 4
});

manager.on('clusterCreate', cluster => console.log(`Launched Cluster ${cluster.id}`));
manager.spawn({timeout: -1});