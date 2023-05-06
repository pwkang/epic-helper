import {ClusterClient, getInfo} from 'discord-hybrid-sharding';
import {Client} from 'discord.js';

import * as dotenv from 'dotenv';

dotenv.config();
const environment = process.env.NODE_ENV || 'development';

const shards = environment === 'development' ? 'auto' : getInfo().SHARD_LIST;

const shardCount = environment === 'development' ? 1 : getInfo().TOTAL_SHARDS;

const client: BotClient = new Client({
  intents: [],
  shardCount,
  shards,
});

if (environment === 'production') {
  client.cluster = new ClusterClient(client); // initialize the Client, so we access the .broadcastEval()
}
client.login(process.env.BOT_TOKEN).then(() => {
  console.log('Logged in!');
});
